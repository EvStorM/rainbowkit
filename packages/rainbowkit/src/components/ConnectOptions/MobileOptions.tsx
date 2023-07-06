import React, { useCallback, useContext, useEffect, useState } from 'react';
import { touchableStyles } from '../../css/touchableStyles';
import openApp from '../../utils/openApp';
import {
  useWalletConnectors,
  WalletConnector,
} from '../../wallets/useWalletConnectors';
import { AsyncImage } from '../AsyncImage/AsyncImage';
import { Box } from '../Box/Box';
import { CloseButton } from '../CloseButton/CloseButton';
import { BackIcon } from '../Icons/Back';
import { QRCode } from '../QRCode/QRCode';
import { AppContext } from '../RainbowKitProvider/AppContext';
import { useRainbowKitChains } from '../RainbowKitProvider/RainbowKitChainContext';
import { useCoolMode } from '../RainbowKitProvider/useCoolMode';
import { setWalletConnectDeepLink } from '../RainbowKitProvider/walletConnectDeepLink';
import { Text } from '../Text/Text';
import * as styles from './MobileOptions.css';

function WalletButton({
  onClose,
  recentstr,
  wallet,
}: {
  wallet: WalletConnector;
  onClose: () => void;
  recentstr?: string;
}) {
  const {
    connect,
    connector,
    iconBackground,
    iconUrl,
    id,
    mobile,
    name,
    onConnecting,
    ready,
    shortName,
  } = wallet;

  const getMobileUri = mobile?.getUri;
  const coolModeRef = useCoolMode(iconUrl);
  const { onError, onLoading, onNotInstalled, onSuccess } =
    useContext(AppContext);
  return (
    <Box
      as="button"
      color={ready ? 'modalText' : 'modalTextSecondary'}
      disabled={!ready}
      fontFamily="body"
      key={id}
      onClick={useCallback(async () => {
        if (wallet.id !== 'walletConnectQR') {
          onLoading?.();
        }
        if (id === 'walletConnect') onClose?.();
        connect?.()
          ?.catch(error => {
            onError?.(error);
            // setConnectionError(true);
          })
          .then(res => {
            if (res) {
              onSuccess?.();
            }
          });
        // We need to guard against "onConnecting" callbacks being fired
        // multiple times since connector instances can be shared between
        // wallets. Ideally wagmi would let us scope the callback to the
        // specific "connect" call, but this will work in the meantime.
        let callbackFired = false;

        onConnecting?.(async () => {
          if (callbackFired) return;
          callbackFired = true;

          if (getMobileUri) {
            const mobileUri = await getMobileUri();

            if (
              connector.id === 'walletConnect' ||
              connector.id === 'walletConnectLegacy'
            ) {
              // In Web3Modal, an equivalent setWalletConnectDeepLink routine gets called after
              // successful connection and then the universal provider uses it on requests. We call
              // it upon onConnecting; this now needs to be called for both v1 and v2 Wagmi connectors.
              // The `connector` type refers to Wagmi connectors, as opposed to RainbowKit wallet connectors.
              // https://github.com/WalletConnect/web3modal/blob/27f2b1fa2509130c5548061816c42d4596156e81/packages/core/src/utils/CoreUtil.ts#L72
              setWalletConnectDeepLink({ mobileUri, name });
            }
            // If the WalletConnect request is rejected, restart the wallet
            // selection flow to create a new connection with a new QR code
            const provider = await wallet?.connector.getProvider();
            const connection = provider?.signer?.connection;
            if (connection?.on && connection?.off) {
              const handleConnectionClose = () => {
                removeHandlers();
              };
              const removeHandlers = () => {
                connection.off('close', handleConnectionClose);
                connection.off('open', removeHandlers);
                // connection.off('error', handleConnectionError);
              };
              connection.on('close', handleConnectionClose);
              connection.on('open', removeHandlers);
              // connection.on('error', handleConnectionError);
            }
            if (mobileUri.startsWith('http')) {
              // Workaround for https://github.com/rainbow-me/rainbowkit/issues/524.
              // Using 'window.open' causes issues on iOS in non-Safari browsers and
              // WebViews where a blank tab is left behind after connecting.
              // This is especially bad in some WebView scenarios (e.g. following a
              // link from Twitter) where the user doesn't have any mechanism for
              // closing the blank tab.
              // For whatever reason, links with a target of "_blank" don't suffer
              // from this problem, and programmatically clicking a detached link
              // element with the same attributes also avoids the issue.
              const link = document.createElement('a');
              link.href = mobileUri;
              link.target = '_blank';
              link.rel = 'noreferrer noopener';
              link.click();
            } else {
              openApp(mobileUri, function () {
                onNotInstalled?.();
              });
              // window.location.href = mobileUri;
            }
          }
        });
      }, [connector, connect, getMobileUri, onConnecting, onClose, name, id])}
      ref={coolModeRef}
      style={{ overflow: 'visible', textAlign: 'center' }}
      testId={`wallet-option-${id}`}
      type="button"
      width="full"
    >
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Box paddingBottom="8" paddingTop="10">
          <AsyncImage
            background={iconBackground}
            borderRadius="13"
            boxShadow="walletLogo"
            height="60"
            src={iconUrl}
            width="60"
          />
        </Box>
        <Box display="flex" flexDirection="column" textAlign="center">
          <Text
            as="h2"
            color={wallet.ready ? 'modalText' : 'modalTextSecondary'}
            size="13"
            weight="medium"
          >
            {/* Fix button text clipping in Safari: https://stackoverflow.com/questions/41100273/overflowing-button-text-is-being-clipped-in-safari */}
            <Box as="span" position="relative">
              {shortName ?? name}
              {!wallet.ready && ' (unsupported)'}
            </Box>
          </Text>
          {wallet.recent && (
            <Text color="accentColor" size="12" weight="medium">
              {recentstr ? recentstr : 'Recent'}
            </Text>
          )}
        </Box>
      </Box>
    </Box>
  );
}

enum MobileWalletStep {
  Connect = 'CONNECT',
  Get = 'GET',
}

export function MobileOptions({ onClose }: { onClose: () => void }) {
  const titleId = 'rk_connect_title';
  const wallets = useWalletConnectors();
  let headerLabel = null;
  let walletContent = null;
  const { loginInfo, mobileQRCode, mobileQRCodeIcon } = useContext(AppContext);
  let headerBackgroundContrast = false;
  let headerBackButtonLink: MobileWalletStep | null = null;
  let chains = useRainbowKitChains();
  const [qrCodeUri, setQrCodeUri] = useState<string>('null');
  const [selectedWallet, setSelectedWallet] = useState<WalletConnector>();
  const [walletStep, setWalletStep] = useState<MobileWalletStep>(
    MobileWalletStep.Connect
  );
  const selectWallet = (wallet: WalletConnector) => {
    if (wallet.ready) {
      wallet
        ?.connect?.()
        ?.catch(() => {
          // setConnectionError(true);
        })
        .then(() => {});
      // We need to guard against "onConnecting" callbacks being fired
      // multiple times since connector instances can be shared between
      // wallets. Ideally wagmi would let us scope the callback to the
      // specific "connect" call, but this will work in the meantime.
      let callbackFired = false;
      wallet?.onConnecting?.(async () => {
        if (callbackFired) return;
        callbackFired = true;
        const uri = await wallet?.qrCode?.getUri();
        setQrCodeUri(uri ?? 'null');

        // This timeout prevents the UI from flickering if connection is instant,
        // otherwise users will see a flash of the "connecting" state.
        setTimeout(
          () => {
            setSelectedWallet(wallet);
          },
          uri ? 0 : 50
        );

        // If the WalletConnect request is rejected, restart the wallet
        // selection flow to create a new connection with a new QR code
        const provider = await wallet?.connector.getProvider();
        const connection = provider?.signer?.connection;
        if (connection?.on && connection?.off) {
          const handleConnectionClose = () => {
            removeHandlers();
            selectWallet(wallet);
          };
          const removeHandlers = () => {
            connection.off('close', handleConnectionClose);
            connection.off('open', removeHandlers);
            // connection.off('error', handleConnectionError);
          };
          connection.on('close', handleConnectionClose);
          connection.on('open', removeHandlers);
          // connection.on('error', handleConnectionError);
        }
      });
    } else {
      // setSelectedWallet(wallet);
    }
  };
  const getWCUrl = async () => {
    const sWallet = wallets.find(w => 'walletConnectQR' === w.id);

    if (sWallet) {
      selectWallet(sWallet);
    }
  };
  useEffect(() => {
    if (chains.length > 0) {
      getWCUrl();
    }
  }, [chains]);

  switch (walletStep) {
    case MobileWalletStep.Connect: {
      headerLabel = loginInfo?.intl?.mobile?.title || 'Connect a Wallet';
      headerBackgroundContrast = selectedWallet ? true : true;
      walletContent = (
        <Box>
          <Box
            background="profileForeground"
            className={styles.scroll}
            display="flex"
            paddingBottom="20"
            paddingTop="20"
          >
            {wallets
              .filter(wallet => wallet.ready)
              .filter(wallet => wallet.id !== 'walletConnectQR')
              .map(wallet => {
                return (
                  <Box key={wallet.id} paddingX="12">
                    <Box
                      style={{
                        width: '72px',
                      }}
                    >
                      <WalletButton
                        onClose={onClose}
                        recentstr={loginInfo?.intl?.mobile?.recent}
                        wallet={wallet}
                      />
                    </Box>
                  </Box>
                );
              })}
          </Box>
          {mobileQRCode && (
            <Box
              alignItems="center"
              background="modalBackground"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              padding="10"
              paddingBottom="36"
              paddingTop="6"
            >
              <Box
                fontFamily="body"
                fontSize="16"
                fontWeight="medium"
                marginBottom="12"
                marginTop="12"
              >
                {loginInfo?.intl?.mobile?.walletConnect}
              </Box>

              <QRCode
                borderWidth="1"
                logoBackground="profileForeground"
                logoSize={72}
                logoUrl={mobileQRCodeIcon ?? loginInfo?.iconUrl}
                padding="16"
                size={240}
                uri={qrCodeUri}
              />
              <Box
                fontSize="12"
                marginBottom="16"
                marginTop="12"
                style={{
                  color: '#888888',
                  fontWeight: '300',
                }}
              >
                {loginInfo?.intl?.mobile?.qrtips}
              </Box>
            </Box>
          )}
        </Box>
      );
      break;
    }
  }

  return (
    <Box background="profileForeground" display="flex" flexDirection="column">
      {/* header section */}
      <Box
        background={
          headerBackgroundContrast ? 'profileForeground' : 'modalBackground'
        }
        display="flex"
        flexDirection="column"
        paddingBottom="4"
        paddingTop="14"
      >
        <Box
          display="flex"
          justifyContent="center"
          paddingBottom="6"
          paddingX="20"
          position="relative"
        >
          {headerBackButtonLink && (
            <Box
              display="flex"
              position="absolute"
              style={{
                left: 0,
                marginBottom: -20,
                marginTop: -20,
              }}
            >
              <Box
                alignItems="center"
                as="button"
                className={touchableStyles({
                  active: 'shrinkSm',
                  hover: 'growLg',
                })}
                color="accentColor"
                display="flex"
                marginLeft="4"
                marginTop="20"
                onClick={() => setWalletStep(headerBackButtonLink!)}
                padding="16"
                style={{ height: 17, willChange: 'transform' }}
                transition="default"
                type="button"
              >
                <BackIcon />
              </Box>
            </Box>
          )}

          <Box marginTop="4" textAlign="center" width="full">
            <Text
              as="h1"
              color="modalText"
              id={titleId}
              size="20"
              weight="bold"
            >
              {headerLabel}
            </Text>
          </Box>

          <Box
            alignItems="center"
            display="flex"
            height="32"
            paddingRight="14"
            position="absolute"
            right="0"
          >
            <Box
              style={{ marginBottom: -20, marginTop: -20 }} // Vertical bleed
            >
              <CloseButton onClose={onClose} />
            </Box>
          </Box>
        </Box>
      </Box>
      <Box display="flex" flexDirection="column">
        {walletContent}
      </Box>
    </Box>
  );
}

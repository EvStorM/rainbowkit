import './global.css';
import 'deme-login/styles.css';
import {
  AvatarComponent,
  connectorsForWallets,
  darkTheme,
  DisclaimerComponent,
  lightTheme,
  midnightTheme,
  RainbowKitProvider,
} from 'deme-login';
import {
  bitKeepWallet,
  imTokenWallet,
  metaMaskWallet,
  mMaskWallet,
  okxWallet,
  tokenPocketWallet,
  trustWallet,
  walletQRWallet,
  zerionWallet,
} from 'deme-login/wallets';

import type { AppProps } from 'next/app';
import Head from 'next/head';
import type { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import {
  configureChains,
  createConfig,
  useDisconnect,
  WagmiConfig,
} from 'wagmi';
import {
  arbitrum,
  base,
  bsc,
  goerli,
  mainnet,
  optimism,
  polygon,
  zora,
} from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { AppContextProps } from '../lib/AppContextProps';
import toast from '../lib/Toast/src';

const RAINBOW_TERMS = 'https://rainbow.me/terms-of-use';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    zora,
    bsc,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [goerli] : []),
  ],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID ?? '' }),
    publicProvider(),
  ]
);

const projectId = '70b8e2cc9a86d6c62c209bf08df51431';
const ops: any = {
  chains,
  projectId,
  walletConnectVersion: '2',
};
const connectors = connectorsForWallets([
  {
    groupName: '推荐',
    wallets: [
      mMaskWallet({ ...ops }),
      metaMaskWallet({ ...ops }),
      bitKeepWallet({ ...ops }),
      okxWallet({ ...ops }),
      // walletConnectWallet({ ...ops }),
      imTokenWallet({ ...ops }),
      trustWallet({ ...ops }),
      tokenPocketWallet({ ...ops }),
      zerionWallet({ ...ops }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: false,
  connectors,
  publicClient,
  webSocketPublicClient,
});

const demoAppInfo = {
  appName: 'Rainbowkit Demo',
};

const loginInfo = {
  iconUrl: 'https://storage.popp.club/files/PoPP_Deme_resize_l_300.png',
  id: '2873',
  intl: {
    closeBtn: '取消',
    connectTitle: '扫码链接',
    errorWallet: 'string',
    getBtn: '获取',
    haveTips: 'string',
    mobile: {
      qrtips: '扫描操作时,请勿退出弹窗',
      recent: '最近使用',
      title: 'Connect a Wallet',
      walletConnect: 'WalletConnet 登录',
    },
    nohaveTips: '没有',
    openBtn: 'OPEN',
    openWallet: '打开',
    retryBtn: '重试',
    title: '链接钱包',
    waitingWallet: '链接浏览器插件中...',
    WalletConnect: {
      tips: '是否打开 WalletConnect 模式?',
      title: 'string',
      WalletConnectModal: {
        copy: 'string',
        qrCode: 'string',
        tips: '',
        title: 'string',
      },
    },
  },
  name: 'DeID Login',
};

const LoginModal = () => {
  return <></>;
};
const DisclaimerDemo: DisclaimerComponent = ({ Link, Text }) => {
  return (
    <Text>
      By connecting, you agree to this demo&apos;s{' '}
      <Link href={RAINBOW_TERMS}>Terms of Service</Link> and acknowledge you
      have read and understand our <Link href={RAINBOW_TERMS}>Disclaimer</Link>
    </Text>
  );
};

const CustomAvatar: AvatarComponent = ({ size }) => {
  return (
    <div
      style={{
        alignItems: 'center',
        backgroundColor: 'lightpink',
        color: 'black',
        display: 'flex',
        height: size,
        justifyContent: 'center',
        width: size,
      }}
    >
      :^)
    </div>
  );
};

const themes = [
  { name: 'light', theme: lightTheme },
  { name: 'dark', theme: darkTheme },
  { name: 'midnight', theme: midnightTheme },
] as const;
type ThemeName = typeof themes[number]['name'];

const fontStacks = ['rounded', 'system'] as const;
type FontStack = typeof fontStacks[number];

const accentColors = [
  'blue',
  'green',
  'orange',
  'pink',
  'purple',
  'red',
  'custom',
] as const;
type AccentColor = typeof accentColors[number];

const radiusScales = ['large', 'medium', 'small', 'none'] as const;
type RadiusScale = typeof radiusScales[number];

const overlayBlurs = ['large', 'small', 'none'] as const;
type OverlayBlur = typeof overlayBlurs[number];

const modalSizes = ['wide', 'compact'] as const;
type ModalSize = typeof modalSizes[number];

function RainbowKitApp({
  Component,
  pageProps,
}: AppProps<{
  session: Session;
}>) {
  const { disconnect } = useDisconnect();
  const [selectedInitialChainId, setInitialChainId] = useState<number>();
  const [selectedThemeName, setThemeName] = useState<ThemeName>('light');
  const [selectedFontStack, setFontStack] = useState<FontStack>('rounded');
  const [selectedAccentColor, setAccentColor] = useState<AccentColor>('blue');
  const [selectedRadiusScale, setRadiusScale] = useState<RadiusScale>('large');
  const [selectedOverlayBlur, setOverlayBlur] = useState<OverlayBlur>('none');
  // const [authEnabled, setAuthEnabled] = useState(false);
  const [authEnabled, setAuthEnabled] = useState(pageProps.session !== null);

  const [showRecentTransactions, setShowRecentTransactions] = useState(false);
  const [coolModeEnabled, setCoolModeEnabled] = useState(false);
  const [modalSize, setModalSize] = useState<ModalSize>('wide');
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [customAvatar, setCustomAvatar] = useState(false);

  const currentTheme = (
    themes.find(({ name }) => name === selectedThemeName) ?? themes[0]
  ).theme;

  const backgroundStyles = {
    dark: { background: '#090913', color: '#FFF' },
    light: null,
    midnight: { background: '#0B0E17', color: '#FFF' },
  };

  const selectedBackgroundStyles = backgroundStyles[selectedThemeName];

  const accentColor =
    selectedAccentColor === 'custom'
      ? { accentColor: 'red', accentColorForeground: 'yellow' } // https://blog.codinghorror.com/a-tribute-to-the-windows-31-hot-dog-stand-color-scheme
      : currentTheme.accentColors[selectedAccentColor];

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const appContextProps: AppContextProps = { authEnabled };

  // Note: Non-RainbowKit providers are wrapped around this component
  // at the bottom of the file. This is so that our example app
  // component can use their corresponding Hooks.
  return (
    <RainbowKitProvider
      appInfo={{
        ...demoAppInfo,
        ...(showDisclaimer && { disclaimer: DisclaimerDemo }),
      }}
      avatar={customAvatar ? CustomAvatar : undefined}
      chains={chains}
      coolMode={coolModeEnabled}
      initialChain={selectedInitialChainId}
      loginInfo={loginInfo}
      loginModal={<LoginModal />}
      modalSize={modalSize}
      onError={error => {
        // window.alert(error.message);
      }}
      onLoading={() => {
        toast.loading('Loading...', {
          duration: 0,
          position: 'bottom-center',
        });
      }}
      onNotInstalled={() => {
        window.alert('error.message');
      }}
      onSuccess={() => {
        window.alert('onSuccess');
      }}
      phoneLogin
      showRecentTransactions={false}
      theme={currentTheme({
        ...accentColor,
        borderRadius: selectedRadiusScale,
        fontStack: selectedFontStack,
        overlayBlur: selectedOverlayBlur,
      })}
    >
      <div
        style={{
          minHeight: '100vh',
          padding: 8,
          ...selectedBackgroundStyles,
        }}
      >
        <Component {...pageProps} {...appContextProps} />

        {isMounted && (
          <>
            <div
              style={{
                fontFamily: 'sans-serif',
              }}
            >
              <h3>RainbowKitProvider props</h3>
              <table cellSpacing={12}>
                <tbody>
                  <tr>
                    <td>
                      <label
                        htmlFor="authEnabled"
                        style={{ userSelect: 'none' }}
                      >
                        authentication
                      </label>
                    </td>
                    <td>
                      <input
                        checked={authEnabled}
                        id="authEnabled"
                        name="authEnabled"
                        onChange={e => {
                          setAuthEnabled(e.target.checked);
                          // Reset connection and auth state when
                          // toggling the authentication mode.
                          // This better simulates the real dev experience
                          // since they don't normally toggle between
                          // these two modes at run time. Otherwise you
                          // might experience weird behavior when toggling
                          // in the middle of a session.
                          signOut({ redirect: false });
                          disconnect();
                        }}
                        type="checkbox"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label
                        htmlFor="showRecentTransactions"
                        style={{ userSelect: 'none' }}
                      >
                        showRecentTransactions
                      </label>
                    </td>
                    <td>
                      <input
                        checked={showRecentTransactions}
                        id="showRecentTransactions"
                        name="showRecentTransactions"
                        onChange={e =>
                          setShowRecentTransactions(e.target.checked)
                        }
                        type="checkbox"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label
                        htmlFor="coolModeEnabled"
                        style={{ userSelect: 'none' }}
                      >
                        coolMode
                      </label>
                    </td>
                    <td>
                      <input
                        checked={coolModeEnabled}
                        id="coolModeEnabled"
                        name="coolModeEnabled"
                        onChange={e => setCoolModeEnabled(e.target.checked)}
                        type="checkbox"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label
                        htmlFor="showDisclaimer"
                        style={{ userSelect: 'none' }}
                      >
                        disclaimer
                      </label>
                    </td>
                    <td>
                      <input
                        checked={showDisclaimer}
                        id="showDisclaimer"
                        name="showDisclaimer"
                        onChange={e => setShowDisclaimer(e.target.checked)}
                        type="checkbox"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label
                        htmlFor="customAvatar"
                        style={{ userSelect: 'none' }}
                      >
                        avatar
                      </label>
                    </td>
                    <td>
                      <input
                        checked={customAvatar}
                        id="customAvatar"
                        name="customAvatar"
                        onChange={e => setCustomAvatar(e.target.checked)}
                        type="checkbox"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>modalSize</td>
                    <td>
                      <select
                        onChange={e =>
                          setModalSize(e.target.value as ModalSize)
                        }
                        value={modalSize}
                      >
                        {modalSizes.map(size => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>initialChain</td>
                    <td>
                      <select
                        onChange={e =>
                          setInitialChainId(
                            e.target.value
                              ? parseInt(e.target.value, 10)
                              : undefined
                          )
                        }
                        value={selectedInitialChainId ?? 'default'}
                      >
                        {[undefined, ...chains].map(chain => (
                          <option key={chain?.id ?? ''} value={chain?.id ?? ''}>
                            {chain?.name ?? 'Default'}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 24,
                }}
              >
                <div>
                  <h4>Theme</h4>
                  <div
                    style={{
                      alignItems: 'flex-start',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12,
                    }}
                  >
                    {themes.map(({ name: themeName }) => (
                      <label key={themeName} style={{ userSelect: 'none' }}>
                        <input
                          checked={themeName === selectedThemeName}
                          name="theme"
                          onChange={e =>
                            setThemeName(e.target.value as ThemeName)
                          }
                          type="radio"
                          value={themeName}
                        />{' '}
                        {themeName}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <h4>Font stack</h4>
                  <div
                    style={{
                      alignItems: 'flex-start',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12,
                    }}
                  >
                    {fontStacks.map(fontStack => (
                      <label key={fontStack} style={{ userSelect: 'none' }}>
                        <input
                          checked={fontStack === selectedFontStack}
                          name="fontStack"
                          onChange={e =>
                            setFontStack(e.target.value as FontStack)
                          }
                          type="radio"
                          value={fontStack}
                        />{' '}
                        {fontStack}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <h4>Accent</h4>
                  <div
                    style={{
                      alignItems: 'flex-start',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12,
                    }}
                  >
                    {accentColors.map(accentColor => (
                      <label key={accentColor} style={{ userSelect: 'none' }}>
                        <input
                          checked={accentColor === selectedAccentColor}
                          name="accentColor"
                          onChange={e =>
                            setAccentColor(e.target.value as AccentColor)
                          }
                          type="radio"
                          value={accentColor}
                        />{' '}
                        {accentColor}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <h4>Border radius</h4>
                  <div
                    style={{
                      alignItems: 'flex-start',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12,
                    }}
                  >
                    {radiusScales.map(radiusScale => (
                      <label key={radiusScale} style={{ userSelect: 'none' }}>
                        <input
                          checked={radiusScale === selectedRadiusScale}
                          name="radiusScale"
                          onChange={e =>
                            setRadiusScale(e.target.value as RadiusScale)
                          }
                          type="radio"
                          value={radiusScale}
                        />{' '}
                        {radiusScale}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <h4>Overlay blurs</h4>
                  <div
                    style={{
                      alignItems: 'flex-start',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12,
                    }}
                  >
                    {overlayBlurs.map(overlayBlur => (
                      <label key={overlayBlur} style={{ userSelect: 'none' }}>
                        <input
                          checked={overlayBlur === selectedOverlayBlur}
                          name="overlayBlur"
                          onChange={e =>
                            setOverlayBlur(e.target.value as OverlayBlur)
                          }
                          type="radio"
                          value={overlayBlur}
                        />{' '}
                        {overlayBlur}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </RainbowKitProvider>
  );
}

export default function App(
  appProps: AppProps<{
    session: Session;
  }>
) {
  useEffect(() => {
    // new MetaMaskSDK();
  }, []);
  return (
    <>
      <Head>
        <title>RainbowKit Example</title>
        <link href="/favicon.ico" rel="icon" />
        {/* <script src="https://unpkg.com/vconsole@latest/dist/vconsole.min.js" />
        <script>vConsole = new window.VConsole();</script> */}
      </Head>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitApp {...appProps} />
      </WagmiConfig>
    </>
  );
}

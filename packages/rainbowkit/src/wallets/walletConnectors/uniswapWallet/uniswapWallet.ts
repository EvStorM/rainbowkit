/* eslint-disable sort-keys-fix/sort-keys-fix */
import type { InjectedConnectorOptions } from '@wagmi/core/connectors/injected';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { Chain } from '../../../components/RainbowKitProvider/RainbowKitChainContext';
import { getWalletConnectUri } from '../../../utils/getWalletConnectUri';
import { isAndroid } from '../../../utils/isMobile';
import { Wallet } from '../../Wallet';
import { getWalletConnectConnector } from '../../getWalletConnectConnector';
import type {
  WalletConnectConnectorOptions,
  WalletConnectLegacyConnectorOptions,
} from '../../getWalletConnectConnector';

export interface OKXWalletLegacyOptions {
  projectId?: string;
  chains: Chain[];
  walletConnectVersion: '1';
  walletConnectOptions?: WalletConnectLegacyConnectorOptions;
}

export interface OKXWalletOptions {
  projectId: string;
  chains: Chain[];
  walletConnectVersion?: '2';
  walletConnectOptions?: WalletConnectConnectorOptions;
}
export const uniswapWallet = ({
  chains,
  projectId,
  walletConnectOptions,
  walletConnectVersion = '2',
  ...options
}: (OKXWalletLegacyOptions | OKXWalletOptions) &
  InjectedConnectorOptions): Wallet => {
  // `isOkxWallet` or `isOKExWallet` needs to be added to the wagmi `Ethereum` object
  const isOKXInjected =
    typeof window !== 'undefined' &&
    // @ts-expect-error
    typeof window.okxwallet !== 'undefined';

  const shouldUseWalletConnect = !isOKXInjected;

  return {
    id: 'Uniswap',
    name: 'Uniswap Wallet',
    iconUrl: async () => (await import('./uniswap.png')).default,
    iconAccent: '#F42BD2',
    iconBackground: '#fff',
    downloadUrls: {
      android: '',
      browserExtension: '',
      ios: 'https://apps.apple.com/us/app/uniswap-wallet/id6443944476',
      qrCode: '',
    },
    createConnector: () => {
      const connector = shouldUseWalletConnect
        ? getWalletConnectConnector({
            projectId,
            chains,
            version: walletConnectVersion,
            options: walletConnectOptions,
          })
        : new InjectedConnector({
            chains,
            options: {
              // @ts-expect-error
              getProvider: () => window.uniswap,
              ...options,
            },
          });

      return {
        connector,
        mobile: {
          getUri: shouldUseWalletConnect
            ? async () => {
                const uri = await getWalletConnectUri(
                  connector,
                  walletConnectVersion
                );
                return isAndroid()
                  ? `uniswap://?action=connect&connectType=wc&value=${encodeURIComponent(
                      uri
                    )}`
                  : `https://uniswap.org/app?value=${encodeURIComponent(uri)}`;
              }
            : undefined,
        },
        qrCode: shouldUseWalletConnect
          ? {
              getUri: async () =>
                getWalletConnectUri(connector, walletConnectVersion),
              instructions: {
                learnMoreUrl: 'https://uniswap.org',
                steps: [
                  {
                    description:
                      'We recommend putting OKX Wallet on your home screen for quicker access.',
                    step: 'install',
                    title: 'Open the OKX Wallet app',
                  },
                  {
                    description:
                      'Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.',
                    step: 'create',
                    title: 'Create or Import a Wallet',
                  },
                  {
                    description:
                      'After you scan, a connection prompt will appear for you to connect your wallet.',
                    step: 'scan',
                    title: 'Tap the scan button',
                  },
                ],
              },
            }
          : undefined,
        extension: {
          instructions: {
            learnMoreUrl: 'https://uniswap.org',
            steps: [
              {
                description:
                  'We recommend pinning OKX Wallet to your taskbar for quicker access to your wallet.',
                step: 'install',
                title: 'Install the OKX Wallet extension',
              },
              {
                description:
                  'Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.',
                step: 'create',
                title: 'Create or Import a Wallet',
              },
              {
                description:
                  'Once you set up your wallet, click below to refresh the browser and load up the extension.',
                step: 'refresh',
                title: 'Refresh your browser',
              },
            ],
          },
        },
      };
    },
  };
};

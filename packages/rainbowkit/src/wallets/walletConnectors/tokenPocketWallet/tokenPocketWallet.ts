/* eslint-disable sort-keys-fix/sort-keys-fix */
import { InjectedConnector } from 'wagmi/connectors/injected';
import { Chain } from '../../../components/RainbowKitProvider/RainbowKitChainContext';
import { isMobile } from '../../../utils/isMobile';
import { Wallet } from '../../Wallet';
import { getWalletConnectConnector } from '../../getWalletConnectConnector';

export interface TokenPocketWalletOptions {
  projectId: string;
  chains: Chain[];
}

export const tokenPocketWallet = ({
  chains,
  projectId,
}: TokenPocketWalletOptions): Wallet => {
  const isTokenPocketInjected =
    typeof window !== 'undefined' && window.ethereum?.isTokenPocket === true;

  const shouldUseWalletConnect = !isTokenPocketInjected;

  return {
    id: 'tokenPocket',
    name: 'TokenPocket',
    iconUrl: async () => (await import('./tokenPocketWallet.svg')).default,
    iconBackground: '#2980FE',
    installed: !shouldUseWalletConnect ? isTokenPocketInjected : undefined,
    downloadUrls: {
      chrome:
        'https://chrome.google.com/webstore/detail/tokenpocket/mfgccjchihfkkindfppnaooecgfneiii',
      browserExtension: 'https://extension.tokenpocket.pro/',
      android:
        'https://play.google.com/store/apps/details?id=vip.mytokenpocket',
      ios: 'https://apps.apple.com/us/app/tp-global-wallet/id6444625622',
      qrCode: 'https://tokenpocket.pro/en/download/app',
      mobile: 'https://tokenpocket.pro/en/download/app',
    },
    createConnector: () => {
      const connector = shouldUseWalletConnect
        ? getWalletConnectConnector({ projectId, chains })
        : new InjectedConnector({ chains });

      const getUri = async () => {
        const uri = (await connector.getProvider())?.connector?.uri;
        return isMobile()
          ? `tpoutside://wc?uri=${encodeURIComponent(uri)}`
          : uri;
      };

      return {
        connector,
        mobile: {
          getUri: shouldUseWalletConnect ? getUri : undefined,
        },
        qrCode: shouldUseWalletConnect
          ? {
              getUri,
              instructions: {
                learnMoreUrl: 'https://help.tokenpocket.pro/en/',
                steps: [
                  {
                    description:
                      'We recommend putting TokenPocket on your home screen for quicker access.',
                    step: 'install',
                    title: 'Open the TokenPocket app',
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
            learnMoreUrl:
              'https://help.tokenpocket.pro/en/extension-wallet/faq/installation-tutorial',
            steps: [
              {
                description:
                  'We recommend pinning TokenPocket to your taskbar for quicker access to your wallet.',
                step: 'install',
                title: 'Install the TokenPocket extension',
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

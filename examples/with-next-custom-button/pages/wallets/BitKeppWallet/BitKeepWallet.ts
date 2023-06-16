/* eslint-disable sort-keys-fix/sort-keys-fix */

import { Chain, Wallet, getWalletConnectConnector, } from '@rainbow-me/rainbowkit';

export interface bitKeepWalletOptions {
  projectId?: string;
  chains: Chain[];
}

export const bitKeepWallet = ({
  projectId,
  chains,
}: bitKeepWalletOptions): Wallet => ({
  id: 'bitKeep wallet',
  name: 'bitKeep wallet',
  iconUrl: async () => (await (import('./bitskiWallet.svg'))).default,
  iconBackground: '#098de6',
  downloadUrls: {
    android: 'https://play.google.com/store/apps/details?id=im.token.app',
    ios: 'https://itunes.apple.com/us/app/imtoken2/id1384798940',
    mobile: 'https://token.im/download',
    qrCode: 'https://token.im/download',
  },
  createConnector: () => {
    const connector = getWalletConnectConnector({ projectId, chains, version: "2" });
    return {
      connector,
      mobile: {
        getUri: async () => {
          const { uri } = (await connector.getProvider())?.connector;
          return `imtokenv2://wc?uri=${encodeURIComponent(uri)}`;
        },
      },
      qrCode: {
        getUri: async () => (await connector.getProvider())?.connector.uri,
        instructions: {
          learnMoreUrl:
            typeof window !== 'undefined' &&
              window.navigator.language.includes('zh')
              ? 'https://support.token.im/hc/zh-cn/categories/360000925393'
              : 'https://support.token.im/hc/en-us/categories/360000925393',
          steps: [
            {
              description:
                'Put imToken app on your home screen for faster access to your wallet.',
              step: 'install',
              title: 'Open the imToken app',
            },
            {
              description: 'Create a new wallet or import an existing one.',
              step: 'create',
              title: 'Create or Import a Wallet',
            },
            {
              description:
                'Choose New Connection, then scan the QR code and confirm the prompt to connect.',
              step: 'scan',
              title: 'Tap Scanner Icon in top right corner',
            },
          ],
        },
      },
    };
  },
});

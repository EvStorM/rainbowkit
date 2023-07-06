/* eslint-disable sort-keys-fix/sort-keys-fix */
import { Chain } from '../../../components/RainbowKitProvider/RainbowKitChainContext';
import { getWalletConnectUri } from '../../../utils/getWalletConnectUri';
import { Wallet } from '../../Wallet';
import { getWalletConnectConnector } from '../../getWalletConnectConnector';
import type {
  WalletConnectConnectorOptions,
  WalletConnectLegacyConnectorOptions,
} from '../../getWalletConnectConnector';

export interface WalletConnectWalletLegacyOptions {
  projectId?: string;
  chains: Chain[];
  walletConnectVersion: '1';
  walletConnectOptions?: WalletConnectLegacyConnectorOptions;
}

export interface WalletConnectWalletOptions {
  projectId: string;
  chains: Chain[];
  walletConnectVersion?: '2';
  walletConnectOptions?: WalletConnectConnectorOptions;
}

export const walletQRWallet = ({
  chains,
  projectId,
  walletConnectOptions,
  walletConnectVersion = '1',
}: WalletConnectWalletLegacyOptions | WalletConnectWalletOptions): Wallet => ({
  id: 'walletConnectQR',
  name: 'walletConnectQR',
  iconUrl: '',
  iconBackground: '#3b99fc',
  createConnector: () => {
    const connector = getWalletConnectConnector({
      version: walletConnectVersion,
      chains,
      projectId,
      options: {
        showQrModal: false,
        ...walletConnectOptions,
      },
    });
    const getUri = async () =>
      getWalletConnectUri(connector, walletConnectVersion);
    return {
      connector,
      ...{
        mobile: { getUri },
        qrCode: { getUri },
      },
    };
  },
});

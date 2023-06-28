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
  version: '1';
  options?: WalletConnectLegacyConnectorOptions;
}

export interface WalletConnectWalletOptions {
  projectId: string;
  chains: Chain[];
  version?: '2';
  options?: WalletConnectConnectorOptions;
}

export const walletQRWallet = ({
  chains,
  options,
  projectId,
  version = '2',
}: WalletConnectWalletLegacyOptions | WalletConnectWalletOptions): Wallet => ({
  id: 'walletConnectQR',
  name: 'walletConnectQR',
  iconUrl: '',
  iconBackground: '#3b99fc',
  createConnector: () => {
    const connector = getWalletConnectConnector({
      version: '2',
      chains,
      projectId,
      options: {
        showQrModal: false,
        ...options,
      },
    });
    const getUri = async () => getWalletConnectUri(connector, version);
    return {
      connector,
      ...{
        mobile: { getUri },
        qrCode: { getUri },
      },
    };
  },
});

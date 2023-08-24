import EventEmitter from 'events';
import {
  Account,
  Chain,
  EIP1193Provider,
  Transport,
  WalletClient as WalletClient_,
} from 'viem';
import type { Address } from 'viem';
import { goerli, mainnet } from 'viem/chains';
import { ConnectorEvents } from 'wagmi';

export type ConnectorData = {
  account?: Address;
  chain?: { id: number; unsupported: boolean };
};
export class ChainNotConfiguredForConnectorError extends Error {
  name = 'ChainNotConfiguredForConnectorError';

  constructor({
    chainId,
    connectorId,
  }: {
    chainId: number;
    connectorId?: string;
  }) {
    super(`Chain "${chainId}" not configured for connector "${connectorId}".`);
  }
}

export class ConnectorNotFoundError extends Error {
  name = 'ConnectorNotFoundError';
  message = 'Connector not found';
}

type InjectedProviderFlags = {
  isApexWallet?: true;
  isAvalanche?: true;
  isBackpack?: true;
  isBifrost?: true;
  isBitKeep?: true;
  isBitski?: true;
  isBlockWallet?: true;
  isBraveWallet?: true;
  isCoinbaseWallet?: true;
  isDawn?: true;
  isDefiant?: true;
  isEnkrypt?: true;
  isExodus?: true;
  isFrame?: true;
  isFrontier?: true;
  isGamestop?: true;
  isHaqqWallet?: true;
  isHyperPay?: true;
  isImToken?: true;
  isKuCoinWallet?: true;
  isMathWallet?: true;
  isMetaMask?: true;
  isNovaWallet?: true;
  isOkxWallet?: true;
  isOKExWallet?: true;
  isOneInchAndroidWallet?: true;
  isOneInchIOSWallet?: true;
  isOpera?: true;
  isPhantom?: true;
  isPortal?: true;
  isRabby?: true;
  isRainbow?: true;
  isStatus?: true;
  isTalisman?: true;
  isTally?: true;
  isTokenPocket?: true;
  isTokenary?: true;
  isTrust?: true;
  isTrustWallet?: true;
  isTTWallet?: true;
  isXDEFI?: true;
  isZerion?: true;
  isHaloWallet?: true;
};

type InjectedProviders = InjectedProviderFlags & {
  isMetaMask: true;
  /** Only exists in MetaMask as of 2022/04/03 */
  _events: {
    connect?: () => void;
  };
  /** Only exists in MetaMask as of 2022/04/03 */
  _state?: {
    accounts?: string[];
    initialized?: boolean;
    isConnected?: boolean;
    isPermanentlyDisconnected?: boolean;
    isUnlocked?: boolean;
  };
};

export interface WindowProvider extends InjectedProviders, EIP1193Provider {
  providers?: WindowProvider[];
}

export type WalletClient<
  TTransport extends Transport = Transport,
  TChain extends Chain = Chain,
  TAccount extends Account = Account
> = WalletClient_<TTransport, TChain, TAccount>;

export type Storage = {
  getItem<T>(key: string, defaultState?: T | null): T | null;
  setItem<T>(key: string, value: T | null): void;
  removeItem(key: string): void;
};

export type StorageStoreData = {
  state: { data?: ConnectorData };
};

export abstract class Connector<
  Provider = any,
  Options = any
> extends EventEmitter {
  /** Unique connector id */
  abstract readonly id: string;
  /** Connector name */
  abstract readonly name: string;
  /** Chains connector supports */
  readonly chains: Chain[];
  /** Options to use with connector */
  readonly options: Options;
  /** Connector storage. */
  protected storage?: Storage;
  /** Whether connector is usable */
  abstract readonly ready: boolean;

  constructor({
    chains = [mainnet, goerli],
    options,
  }: {
    chains?: Chain[];
    options: Options;
  }) {
    super();
    this.chains = chains;
    this.options = options;
  }

  abstract connect(config?: {
    chainId?: number;
  }): Promise<Required<ConnectorData>>;
  abstract disconnect(): Promise<void>;
  abstract getAccount(): Promise<Address>;
  abstract getChainId(): Promise<number>;
  abstract getProvider(config?: { chainId?: number }): Promise<Provider>;
  abstract getWalletClient(config?: {
    chainId?: number;
  }): Promise<WalletClient>;
  abstract isAuthorized(): Promise<boolean>;
  switchChain?(chainId: number): Promise<Chain>;
  watchAsset?(asset: {
    address: string;
    decimals?: number;
    image?: string;
    symbol: string;
  }): Promise<boolean>;

  protected abstract onAccountsChanged(accounts: Address[]): void;
  protected abstract onChainChanged(chain: number | string): void;
  protected abstract onDisconnect(error: Error): void;

  protected getBlockExplorerUrls(chain: Chain) {
    const { default: blockExplorer, ...blockExplorers } =
      chain.blockExplorers ?? {};
    if (blockExplorer)
      return [
        blockExplorer.url,
        ...Object.values(blockExplorers).map((x: any) => x.url),
      ];
  }

  protected isChainUnsupported(chainId: number) {
    return !this.chains.some(x => x.id === chainId);
  }

  setStorage(storage: Storage) {
    this.storage = storage;
  }
}

export function normalizeChainId(chainId: string | number | bigint | null) {
  if (typeof chainId === 'string')
    return Number.parseInt(
      chainId,
      chainId.trim().substring(0, 2) === '0x' ? 16 : 10
    );
  if (typeof chainId === 'bigint') return Number(chainId);
  return chainId;
}

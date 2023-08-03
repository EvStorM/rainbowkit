// import MetaMaskSDK, { MetaMaskSDKOptions, SDKProvider } from '@metamask/sdk';

// import {
//   type Address,
//   Chain,
//   createWalletClient,
//   custom,
//   getAddress,
//   numberToHex,
//   ProviderRpcError,
//   stringToHex,
//   SwitchChainError,
//   UserRejectedRequestError,
// } from 'viem';

// import { isMobile } from '../../utils/isMobile';
// import openApp from '../../utils/openApp';
// import {
//   ChainNotConfiguredForConnectorError,
//   Connector,
//   ConnectorNotFoundError,
//   normalizeChainId,
//   WalletClient,
// } from './types';
// type Options = Omit<MetaMaskSDKOptions, 'reloadOnDisconnect'> & {
//   /**
//    * Fallback Ethereum JSON RPC URL
//    * @default ""
//    */
//   jsonRpcUrl?: string;
//   /**
//    * Fallback Ethereum Chain ID
//    * @default 1
//    */
//   chainId?: number;
//   /**
//    * Whether or not to reload dapp automatically after disconnect.
//    */
//   reloadOnDisconnect?: boolean;
// };

// export class MMSKWalletConnector extends Connector<MetaMaskSDK, Options> {
//   readonly id = 'mmskWallet';
//   readonly name = 'MetaMask Wallet';
//   readonly ready = true;

//   #client?: MetaMaskSDK;
//   #provider?: SDKProvider;
//   constructor({ chains, options }: { chains?: Chain[]; options: Options }) {
//     const voptions = isMobile()
//       ? {
//         forceInjectProvider: true,
//         forceRestartWalletConnect: true,
//         openDeeplink: (url: string) => {
//           // console.log(
//           //   '%c [ url ]-55-「MMSKConnector.ts」',
//           //   'font-size:13px; background:#FFE47F; color:#000000;',
//           //   url
//           // );
//           const newUrl = url.replace(
//             'https://metamask.app.link/connect?',
//             'metamask://connect?connect=1&'
//           );
//           openApp(newUrl, {});
//         },
//         ...options,
//       }
//       : {
//         ...options,
//       };
//     super({
//       chains,
//       options: voptions,
//     });
//   }

//   async connect({ chainId }: { chainId?: number } = {}) {
//     try {
//       const provider = await this.getProvider();
//       provider.on('accountsChanged', this.onAccountsChanged);
//       // provider.on('chainChanged', this.onChainChanged);
//       provider.on('disconnect', this.onDisconnect);
//       provider.on('message', this.onMessage);
//       await provider.request({ method: 'eth_requestAccounts' });
//       (this as any).emit('message', { type: 'connecting' });
//       const accounts = provider.selectedAddress;
//       const account = getAddress(accounts as string);
//       // Switch to chain if provided
//       let id = await this.getChainId();
//       let unsupported = this.isChainUnsupported(id);
//       if (chainId && id !== chainId) {
//         const chain = await this.switchChain(chainId);
//         id = chain.id;
//         unsupported = this.isChainUnsupported(id);
//       }

//       return {
//         account,
//         chain: { id, unsupported },
//       };
//     } catch (error) {
//       if (
//         /(user closed modal|accounts received is empty)/i.test(
//           (error as Error).message
//         )
//       )
//         throw new UserRejectedRequestError(error as Error);
//       throw error;
//     }
//   }

//   async disconnect() {
//     if (!this.#provider) return;
//     const provider = (window as any).ethereum;
//     // const provider = await this.getProvider();
//     provider?.removeListener('accountsChanged', this.onAccountsChanged);
//     // provider?.removeListener('chainChanged', this.onChainChanged);
//     provider?.removeListener('disconnect', this.onDisconnect);
//     provider?.removeListener('message', this.onMessage);

//     // provider.disconnect();
//     // provider.close();
//   }
//   async getAccount() {
//     const provider = await this.getProvider();
//     const accounts = await provider.request<Address[]>({
//       method: 'eth_accounts',
//     });
//     // return checksum address
//     return getAddress(accounts?.[0] as string);
//   }

//   async getChainId() {
//     const provider = await this.getProvider();
//     const chainId = normalizeChainId(provider.chainId);
//     return chainId as number;
//   }

//   async getProvider() {
//     if (!this.#provider) {
//       let MetaMaskWalletSDK = MetaMaskSDK;
//       // Workaround for Vite dev import errors
//       // https://github.com/vitejs/vite/issues/7112
//       if (
//         typeof MetaMaskWalletSDK !== 'function' &&
//         // @ts-expect-error This import error is not visible to TypeScript
//         typeof MetaMaskWalletSDK.default === 'function'
//       )
//         MetaMaskWalletSDK = (
//           MetaMaskWalletSDK as unknown as { default: typeof MetaMaskSDK }
//         ).default;
//       this.#client = new MetaMaskWalletSDK(this.options);

//       /**
//        * Mock implementations to retrieve private `walletExtension` method
//        * from the Coinbase Wallet SDK.
//        */
//       abstract class WalletProvider {
//         // https://github.com/coinbase/coinbase-wallet-sdk/blob/b4cca90022ffeb46b7bbaaab9389a33133fe0844/packages/wallet-sdk/src/provider/CoinbaseWalletProvider.ts#L927-L936
//         abstract getChainId(): number;
//       }
//       abstract class Client {
//         // https://github.com/coinbase/coinbase-wallet-sdk/blob/b4cca90022ffeb46b7bbaaab9389a33133fe0844/packages/wallet-sdk/src/CoinbaseWalletSDK.ts#L233-L235
//         abstract get walletExtension(): WalletProvider | undefined;
//       }
//       const walletExtensionChainId = (
//         this.#client as unknown as Client
//       ).walletExtension?.getChainId();

//       const chain =
//         this.chains.find(chain =>
//           this.options.chainId
//             ? chain.id === this.options.chainId
//             : chain.id === walletExtensionChainId
//         ) || this.chains[0];
//       const chainId = this.options.chainId || chain?.id;
//       this.#provider = this.#client.getProvider() ?? new SDKProvider(chainId);
//     }
//     return this.#provider;
//   }

//   async isAuthorized() {
//     try {
//       if (
//         this.options.shimDisconnect &&
//         // If shim does not exist in storage, wallet is disconnected
//         !this.storage?.getItem(this.shimDisconnectKey)
//       )
//         return false;
//       const provider = await this.getProvider();
//       if (!provider) throw new ConnectorNotFoundError();
//       const account = await this.getAccount();
//       return !!account;
//     } catch {
//       return false;
//     }
//   }

//   async switchChain(chainId: number) {
//     const provider = await this.getProvider();
//     const id = numberToHex(chainId);

//     try {
//       await provider.request({
//         method: 'wallet_switchEthereumChain',
//         params: [{ chainId: id }],
//       });
//       return (
//         this.chains.find(x => x.id === chainId) ?? {
//           id: chainId,
//           name: `Chain ${id}`,
//           nativeCurrency: { decimals: 18, name: 'Ether', symbol: 'ETH' },
//           network: `${id}`,
//           rpcUrls: { default: { http: [''] }, public: { http: [''] } },
//         }
//       );
//     } catch (error) {
//       const chain = this.chains.find(x => x.id === chainId);
//       if (!chain)
//         throw new ChainNotConfiguredForConnectorError({
//           chainId,
//           connectorId: this.id,
//         });

//       // Indicates chain is not added to provider
//       if ((error as ProviderRpcError).code === 4902) {
//         try {
//           await provider.request({
//             method: 'wallet_addEthereumChain',
//             params: [
//               {
//                 blockExplorerUrls: this.getBlockExplorerUrls(chain),
//                 chainId: id,
//                 chainName: chain.name,
//                 nativeCurrency: chain.nativeCurrency,
//                 rpcUrls: [chain.rpcUrls.public?.http[0] ?? ''],
//               },
//             ],
//           });
//           return chain;
//         } catch (error) {
//           throw new UserRejectedRequestError(error as Error);
//         }
//       }

//       throw new SwitchChainError(error as Error);
//     }
//   }

//   async watchAsset({
//     address,
//     decimals = 18,
//     image,
//     symbol,
//   }: {
//     address: string;
//     decimals?: number;
//     image?: string;
//     symbol: string;
//   }) {
//     const provider = await this.getProvider();
//     return provider.request<boolean>({
//       method: 'wallet_watchAsset',
//       params: {
//         options: {
//           address,
//           decimals,
//           image,
//           symbol,
//         },
//         type: 'ERC20',
//       },
//     });
//   }

//   protected onAccountsChanged = (accounts: any) => {
//     if (accounts.length === 0) (this as any).emit('disconnect');
//     else (this as any).emit('change', { account: getAddress(accounts[0] as string) });
//   };

//   protected onChainChanged = (chainId: any) => {
//     const id = normalizeChainId(chainId);
//     const unsupported = this.isChainUnsupported(id ?? 0);
//     (this as any).emit('change', { chain: { id, unsupported } });
//   };

//   protected onDisconnect = () => {
//     (this as any).emit('disconnect');
//     this.#client?.disconnect();
//   };

//   protected onMessage = () => {
//     (this as any).emit('connect', {});
//   };
//   protected isUserRejectedRequestError(error: unknown) {
//     return (error as ProviderRpcError).code === 4001;
//   }

//   async getWalletClient({
//     chainId,
//   }: { chainId?: number } = {}): Promise<WalletClient> {
//     const [provider, account] = await Promise.all([
//       this.getProvider(),
//       this.getAccount(),
//     ]);
//     const chain = this.chains.find(x => x.id === chainId);
//     if (!provider) throw new Error('provider is required.');

//     const walletClient = createWalletClient({
//       account,
//       chain,
//       transport: custom(provider ?? window.ethereum),
//     });
//     walletClient.signMessage = async ({
//       account: account_ = account,
//       message,
//     }) => {
//       const provider = await this.getProvider();
//       openApp('metamask://', {});
//       const message_ = (() => {
//         if (typeof message === 'string') return stringToHex(message);
//         return message;
//       })();
//       const sign = await provider.request({
//         method: 'personal_sign',
//         params: [message_, account_],
//       });
//       return sign;
//     };
//     return walletClient;
//   }
// }

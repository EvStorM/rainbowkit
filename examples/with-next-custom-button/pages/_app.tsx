import '../styles/global.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
  useCloseModal,
} from '@rainbow-me/rainbowkit';
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, goerli } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [goerli] : []),
  ],
  [publicProvider()]
);

const projectId = 'YOUR_PROJECT_ID';

const { wallets } = getDefaultWallets({
  appName: 'RainbowKit demo',
  projectId,
  chains,
});

const demoAppInfo = {
  appName: 'Rainbowkit Demo',
};

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: 'Other',
    wallets: [
      argentWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
      ledgerWallet({ projectId, chains }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

const LoginModal = () => {
  const { closeConnectModal, closeModals } = useCloseModal();
  return (
    <>
      <div
        onClick={() => {
          closeModals?.();
        }}
      >
        close
      </div>
      <div onClick={() => {}}>close</div>
      <div onClick={() => {}}>close</div>
      <div onClick={() => {}}>close</div>
    </>
  );
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        appInfo={demoAppInfo}
        chains={chains}
        loginInfo={{
          name: 'RainbowKit Demo',
          intl: {
            title: '链接钱包',
            connectTitle: '扫码链接',
            haveTips: 'string',
            nohaveTips: '没有',
            openBtn: 'OPEN',
            getBtn: '获取',
            openWallet: '打开',
            waitingWallet: '链接浏览器插件中...',
            closeBtn: '取消',
            retryBtn: '重试',
            errorWallet: 'string',
            WalletConnect: {
              title: 'string',
              tips: '是否打开 WalletConnect 模式?',
              WalletConnectModal: {
                title: 'string',
                qrCode: 'string',
                copy: 'string',
              },
            },
          },
          iconUrl:
            'https://img2.baidu.com/it/u=2685277441,3392388146&fm=253&fmt=auto&app=120&f=JPEG?w=400&h=400',
          id: '2873',
        }}
        loginModal={<LoginModal></LoginModal>}
      >
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;

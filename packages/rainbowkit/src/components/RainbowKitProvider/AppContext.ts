import React, { createContext, ReactNode } from 'react';

export type DisclaimerComponent = React.FunctionComponent<{
  Text: React.FunctionComponent<{ children: ReactNode }>;
  Link: React.FunctionComponent<{ children: ReactNode; href: string }>;
}>;

export type loginInfoType = {
  iconUrl: string;
  name: string;
  id: string;
  intl?: {
    title?: string;
    connectTitle?: string;
    haveTips?: string;
    nohaveTips?: string;
    openBtn?: string;
    getBtn?: string;
    openWallet?: string;
    waitingWallet?: string;
    closeBtn?: string;
    retryBtn?: string;
    errorWallet?: string;
    mobile?: {
      qrtips: string;
      title: string;
      walletConnect: string;
      recent: string;
    };
    WalletConnect?: {
      title?: string;
      tips?: string;
      WalletConnectModal?: {
        title?: string;
        qrCode?: string;
        copy?: string;
      };
    };
  };
};

export const defaultAppInfo = {
  appName: undefined,
  disclaimer: undefined,
  learnMoreUrl:
    'https://learn.rainbow.me/understanding-web3?utm_source=rainbowkit&utm_campaign=learnmore',
  loginInfo: undefined,
  loginModal: undefined,
};

export const AppContext = createContext<{
  loginModal?: ReactNode;
  appName?: string;
  learnMoreUrl?: string;
  disclaimer?: DisclaimerComponent;
  loginInfo?: loginInfoType;
  mobileQRCode?: boolean;
  phoneLogin?: boolean;
  onLoading?: () => void;
  onSuccess?: () => void;
  onNotInstalled?: () => void;
  onCallSuccess?: () => void;
  onError?: (error: any) => void;
  mobileQRCodeIcon?: string | (() => Promise<string>);
}>(defaultAppInfo);

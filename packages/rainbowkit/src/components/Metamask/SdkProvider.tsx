import React, { PropsWithChildren, useEffect } from 'react';
import { useListen } from './useListen';
import { useMetaMask } from './useMetaMask';
export const SdkLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const { dispatch } = useMetaMask();
  const listen = useListen();
  useEffect(() => {
    // start by checking if window.ethereum is present, indicating a wallet extension
    const ethereumProviderInjected = typeof window.ethereum !== 'undefined';
    // this could be other wallets so we can verify if we are dealing with metamask
    // using the boolean constructor to be explecit and not let this be used as a falsy value (optional)
    const isMetaMaskInstalled =
      ethereumProviderInjected && Boolean((window as any).ethereum.isMetaMask);
    const local = window.localStorage.getItem('metamaskState');

    // user was previously connected, start listening to MM
    if (local) {
      listen();
    }

    // local could be null if not present in LocalStorage
    const { balance, wallet } = local
      ? JSON.parse(local)
      : // backup if local storage is empty
        { balance: null, wallet: null };

    dispatch({ balance, isMetaMaskInstalled, type: 'pageLoaded', wallet });
  }, []);

  return <div>{children}</div>;
};

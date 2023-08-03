import { useMetaMask } from './useMetaMask';

function isAccountList(accounts: unknown): accounts is string[] {
  return (
    Array.isArray(accounts) &&
    accounts.every(account => typeof account === 'string')
  );
}

export const useListen = () => {
  const { dispatch } = useMetaMask();

  return () => {
    (window as any).ethereum?.on(
      'accountsChanged',
      async (newAccounts: any) => {
        if (isAccountList(newAccounts) && newAccounts.length > 0) {
          // upon receiving a new wallet, we'll request the balance to synchronize the UI again.
          const newBalance = await window.ethereum!.request({
            method: 'eth_getBalance',
            params: [newAccounts[0], 'latest'],
          });

          const narrowedBalance =
            typeof newBalance === 'string' ? newBalance : '';

          dispatch({
            balance: narrowedBalance,
            type: 'connect',
            wallet: newAccounts[0],
          });
        } else {
          // if the length is 0, then the user has disconnected from the wallet UI
          dispatch({ type: 'disconnect' });
        }
      }
    );
  };
};

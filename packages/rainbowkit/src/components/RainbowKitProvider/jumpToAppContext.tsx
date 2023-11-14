import React, { createContext, useContext } from 'react';
import { EmojiAvatar } from '../Avatar/EmojiAvatar';
import openApp from '../../utils/openApp';
import { AppContext } from './AppContext';

interface JumpAppProvider {
  children: React.ReactNode;
}

interface JumpAppContextProvider {
  jumpApp: (uri: string) => void;
  appurl: string;
  setAppUrl: React.Dispatch<React.SetStateAction<string>>;
}

export const JumpAppContext = createContext<JumpAppContextProvider>({
  jumpApp: (uri: string) => {},
  appurl: '',
  setAppUrl: () => {},
});

export const JumpAppProvider = ({ children }: JumpAppProvider) => {
  const [appurl, setAppUrl] = React.useState<string>('');
  const { onCallSuccess, onNotInstalled } = useContext(AppContext);
  return (
    <JumpAppContext.Provider
      value={{
        jumpApp: (uri: string) => {
          openApp(uri ?? appurl, {
            callFailed: onNotInstalled,
            callSuccess: onCallSuccess,
          });
        },
        appurl,
        setAppUrl,
      }}
    >
      {children}
    </JumpAppContext.Provider>
  );
};

export function useJumpApp() {
  const { jumpApp, appurl, setAppUrl } = useContext(JumpAppContext);
  return { jumpApp, appurl, setAppUrl };
}

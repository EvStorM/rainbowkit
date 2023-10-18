import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { useConnectionStatus } from '../../hooks/useConnectionStatus';
import { AccountModal } from '../AccountModal/AccountModal';
import { BlockModal } from '../BlockModal/BlockModal';
import { ChainModal } from '../ChainModal/ChainModal';
import { ConnectModal } from '../ConnectModal/ConnectModal';
import { useAuthenticationStatus } from './AuthenticationContext';

function useModalStateValue() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [maskClose, setMaskClose] = useState(true);
  const [children, setChildren] = useState<ReactNode>(null);
  return {
    children,
    closeModal: useCallback(() => {
      setModalOpen(false);
    }, []),
    isModalOpen,
    maskClose,
    openModal: useCallback((mask?: boolean) => {
      if (mask) {
        setMaskClose(true);
      }
      setModalOpen(true);
    }, []),
    setChildren,
  };
}

interface ModalContextValue {
  accountModalOpen: boolean;
  chainModalOpen: boolean;
  blockModalOpen: boolean;
  connectModalOpen: boolean;
  openAccountModal?: () => void;
  openChainModal?: () => void;
  openConnectModal?: (mask?: boolean) => void;
  openBlockModal?: () => void;
  setChildren?: (children: ReactNode) => void;
  closeBlockModal?: () => void;
  closeAccountModal?: () => void;
  closeChainModal?: () => void;
  closeConnectModal?: () => void;
  closeModals?: (options?: { keepConnectModalOpen?: boolean }) => void;
}

const ModalContext = createContext<ModalContextValue>({
  accountModalOpen: false,
  blockModalOpen: false,
  chainModalOpen: false,
  connectModalOpen: false,
});

interface ModalProviderProps {
  children: ReactNode;
}

export function ModalProvider({ children }: ModalProviderProps) {
  const {
    closeModal: closeConnectModal,
    isModalOpen: connectModalOpen,
    maskClose,
    openModal: openConnectModal,
  } = useModalStateValue();

  const {
    closeModal: closeAccountModal,
    isModalOpen: accountModalOpen,
    openModal: openAccountModal,
  } = useModalStateValue();

  const {
    closeModal: closeChainModal,
    isModalOpen: chainModalOpen,
    openModal: openChainModal,
  } = useModalStateValue();
  const {
    children: blockModalChildren,
    closeModal: closeBlockModal,
    isModalOpen: blockModalOpen,
    openModal: openBlockModal,
    setChildren,
  } = useModalStateValue();
  const connectionStatus = useConnectionStatus();
  const { chain } = useNetwork();
  const chainSupported = !chain?.unsupported;

  interface CloseModalsOptions {
    keepConnectModalOpen?: boolean;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const closeModals = ({
    keepConnectModalOpen = false,
  }: CloseModalsOptions = {}) => {
    if (!keepConnectModalOpen) {
      closeConnectModal();
    }
    closeAccountModal();
    closeChainModal();
  };

  const isUnauthenticated = useAuthenticationStatus() === 'unauthenticated';
  useAccount({
    onConnect: () => closeModals({ keepConnectModalOpen: isUnauthenticated }),
    onDisconnect: () => closeModals(),
  });

  return (
    <ModalContext.Provider
      value={useMemo(
        () => ({
          accountModalOpen,
          blockModalChildren,
          blockModalOpen,
          chainModalOpen,
          closeAccountModal,
          closeBlockModal,
          closeChainModal,
          closeConnectModal,
          closeModals,
          connectModalOpen,
          openAccountModal:
            chainSupported && connectionStatus === 'connected'
              ? openAccountModal
              : undefined,
          openBlockModal,
          openChainModal:
            connectionStatus === 'connected' ? openChainModal : undefined,
          openConnectModal:
            connectionStatus === 'disconnected' ||
            connectionStatus === 'unauthenticated'
              ? openConnectModal
              : undefined,
          setChildren,
        }),
        [
          accountModalOpen,
          blockModalChildren,
          blockModalOpen,
          chainModalOpen,
          closeAccountModal,
          closeBlockModal,
          closeChainModal,
          closeConnectModal,
          closeModals,
          connectModalOpen,
          chainSupported,
          connectionStatus,
          openAccountModal,
          openBlockModal,
          openChainModal,
          openConnectModal,
          setChildren,
        ]
      )}
    >
      {children}
      <ConnectModal
        maskClose={maskClose}
        onClose={closeConnectModal}
        open={connectModalOpen}
      />
      <BlockModal
        children={blockModalChildren}
        onClose={closeBlockModal}
        open={blockModalOpen}
      />
      <AccountModal onClose={closeAccountModal} open={accountModalOpen} />
      <ChainModal onClose={closeChainModal} open={chainModalOpen} />
    </ModalContext.Provider>
  );
}

export function useModalState() {
  const { accountModalOpen, chainModalOpen, connectModalOpen } =
    useContext(ModalContext);

  return {
    accountModalOpen,
    chainModalOpen,
    connectModalOpen,
  };
}

export function useCloseModal() {
  const { closeAccountModal, closeChainModal, closeConnectModal, closeModals } =
    useContext(ModalContext);
  return { closeAccountModal, closeChainModal, closeConnectModal, closeModals };
}

export function useAccountModal() {
  const { accountModalOpen, closeAccountModal, openAccountModal } =
    useContext(ModalContext);
  return { accountModalOpen, closeAccountModal, openAccountModal };
}

export function useChainModal() {
  const { chainModalOpen, closeChainModal, openChainModal } =
    useContext(ModalContext);
  return { chainModalOpen, closeChainModal, openChainModal };
}

export function useConnectModal() {
  const { closeConnectModal, connectModalOpen, openConnectModal } =
    useContext(ModalContext);
  return { closeConnectModal, connectModalOpen, openConnectModal };
}

export function useBlockModal() {
  const { closeBlockModal, openBlockModal, setChildren } =
    useContext(ModalContext);
  return { closeBlockModal, openBlockModal, setChildren };
}

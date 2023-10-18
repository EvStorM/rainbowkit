import React from 'react';
import { useConnectionStatus } from '../../hooks/useConnectionStatus';
import ConnectOptions from '../ConnectOptions/ConnectOptions';
import { Dialog } from '../Dialog/Dialog';
import { DialogContent } from '../Dialog/DialogContent';
import { SignIn } from '../SignIn/SignIn';
export interface ConnectModalProps {
  open: boolean;
  onClose: () => void;
  maskClose?: boolean;
}

export function ConnectModal({ maskClose, onClose, open }: ConnectModalProps) {
  const titleId = 'rk_connect_title';
  const connectionStatus = useConnectionStatus();
  if (connectionStatus === 'disconnected') {
    return (
      <Dialog
        maskClose={maskClose}
        onClose={onClose}
        open={open}
        titleId={titleId}
      >
        <DialogContent bottomSheetOnMobile padding="0" wide>
          <ConnectOptions onClose={onClose} />
        </DialogContent>
      </Dialog>
    );
  }

  if (connectionStatus === 'unauthenticated') {
    return (
      <Dialog
        maskClose={maskClose}
        onClose={onClose}
        open={open}
        titleId={titleId}
      >
        <DialogContent bottomSheetOnMobile padding="0">
          <SignIn onClose={onClose} />
        </DialogContent>
      </Dialog>
    );
  }

  return null;
}

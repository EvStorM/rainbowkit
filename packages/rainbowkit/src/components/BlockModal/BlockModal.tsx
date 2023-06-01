import React from 'react';
import { Box } from '../Box/Box';
import { CloseButton } from '../CloseButton/CloseButton';
import { Dialog } from '../Dialog/Dialog';
import { DialogContent } from '../Dialog/DialogContent';
export interface BlockModalProps {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export function BlockModal({ children, onClose, open }: BlockModalProps) {
  const titleId = 'rk_block_title';
  return (
    <Dialog onClose={onClose} open={open} titleId={titleId}>
      <DialogContent auto bottomSheetOnMobile padding="0">
        <Box
          display="flex"
          flexDirection="column"
          margin="16"
          style={{
            padding: '12px 12px 18px 12px',
          }}
        >
          <Box
            alignItems="center"
            display="flex"
            justifyContent="flex-end"
            marginBottom="12"
          >
            <CloseButton onClose={onClose} />
          </Box>
          <Box display="flex" flexDirection="column">
            <Box
              alignItems="center"
              display="flex"
              flexDirection="column"
              gap="6"
              height="full"
              justifyContent="center"
              marginX="8"
            >
              {children}
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

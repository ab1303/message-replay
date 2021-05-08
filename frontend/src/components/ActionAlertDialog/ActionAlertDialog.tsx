import React, { useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/core';

export interface ActionAlertDialogProps {
  header: string;
  actionText?: string;
  actionColor?: string;
  cancelActionText?: string;
  openDialog: boolean;
  onClose: () => void;
  onAction: () => void;
}

const ActionAlertDialog: React.FC<ActionAlertDialogProps> = ({
  header,
  openDialog,
  actionText = 'Confirm',
  actionColor = 'red',
  cancelActionText = 'Cancel',
  onClose,
  onAction,
  children,
}) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(openDialog);
  const cancelRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsOpen(openDialog);
  }, [openDialog]);

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader fontSize="lg" fontWeight="bold">
          {header}
        </AlertDialogHeader>

        <AlertDialogBody>{children}</AlertDialogBody>

        <AlertDialogFooter>
          <Button ref={cancelRef} onClick={onClose}>
            {cancelActionText}
          </Button>
          <Button variantColor={actionColor} onClick={onAction} ml={3}>
            {actionText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

ActionAlertDialog.displayName = 'ActionAlertDialog';

export default ActionAlertDialog;

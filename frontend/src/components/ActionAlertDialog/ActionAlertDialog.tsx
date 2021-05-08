import React, { useEffect, useMemo } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  useColorMode,
} from '@chakra-ui/core';
import { DefaultSpinner } from '..';

export interface ActionAlertDialogProps {
  header: string;
  actionText?: string;
  actionColor?: string;
  cancelActionText?: string;
  openDialog: boolean;
  isLoading: boolean;
  onClose: () => void;
  onAction: () => void;
}

const ActionAlertDialog: React.FC<ActionAlertDialogProps> = ({
  header,
  openDialog,
  isLoading,
  actionText = 'Confirm',
  actionColor = 'red',
  cancelActionText = 'Cancel',
  onClose,
  onAction,
  children,
}) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(openDialog);
  const cancelRef = React.useRef<HTMLInputElement>(null);
  const { colorMode } = useColorMode();
  const bg = useMemo(() => (colorMode === 'dark' ? 'gray.600' : 'gray.50'), [
    colorMode,
  ]);

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

        <AlertDialogBody>
          <Box bg={bg} w="100%" p={4}>
            {children}
          </Box>
        </AlertDialogBody>

        <AlertDialogFooter>
          {isLoading ? (
            <DefaultSpinner />
          ) : (
            <>
              <Button ref={cancelRef} onClick={onClose}>
                {cancelActionText}
              </Button>
              <Button variantColor={actionColor} onClick={onAction} ml={3}>
                {actionText}
              </Button>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

ActionAlertDialog.displayName = 'ActionAlertDialog';

export default ActionAlertDialog;

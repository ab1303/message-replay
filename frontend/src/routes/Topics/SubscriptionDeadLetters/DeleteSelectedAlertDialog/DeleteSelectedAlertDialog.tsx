import { Box, useColorMode, useToast } from '@chakra-ui/core';
import { AxiosError } from 'axios';
import React, { useMemo } from 'react';
import ActionAlertDialog, {
  ActionAlertDialogProps,
  DefaultSpinner,
} from 'src/components';
import { DeleteSelectedDlqMessagesResponse } from '../types';
import { useDeleteSelectedMutation } from '../useDeleteSelectedMutation';

interface DeleteSelectedAlertDialogProps
  extends Omit<ActionAlertDialogProps, 'onAction'> {
  messageIds: string[];
  topic: string;
  subscription: string;
  onActionSuccess: (data: DeleteSelectedDlqMessagesResponse) => void;
}

const DeleteSelectedAlertDialog: React.FC<DeleteSelectedAlertDialogProps> = ({
  messageIds,
  topic,
  subscription,
  onActionSuccess,
  ...props
}) => {
  const toast = useToast();

  const { colorMode } = useColorMode();
  const bg = useMemo(() => (colorMode === 'dark' ? 'gray.600' : 'gray.50'), [
    colorMode,
  ]);

  const {
    mutate: deleteSelectedMutation,
    isLoading,
  } = useDeleteSelectedMutation(topic, subscription);

  const deleteSelectedHandler = () => {
    deleteSelectedMutation(
      {
        messageIds,
      },
      {
        onSuccess: result => {
          onActionSuccess(result.data);

          toast({
            title: 'Subscription - DeadLetters.',
            description: 'Selected Messages Deleted successfully!',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        },
        onError: (error: AxiosError) => {
          toast({
            title: 'Server Error',
            description: error.message,
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        },
      },
    );
  };

  return (
    <ActionAlertDialog {...props} onAction={deleteSelectedHandler}>
      {isLoading ? (
        <DefaultSpinner />
      ) : (
        <Box bg={bg} w="100%" p={4}>
          Deleting requires receiving messages to perform and this increases the
          DeliveryCount of the messages. There can be consequences to other
          messages in this subscription, Are you sure? Are you sure you would
          like to delete messages AND increase the delivery count.
        </Box>
      )}
    </ActionAlertDialog>
  );
};

export default DeleteSelectedAlertDialog;

import React, { useMemo } from 'react';
import { Text, useColorMode, useToast } from '@chakra-ui/core';
import { AxiosError } from 'axios';
import ActionAlertDialog, { ActionAlertDialogProps } from 'src/components';
import { DeleteSelectedDlqMessagesResponse } from '../types';
import { useDeleteSelectedMutation } from '../useDeleteSelectedMutation';
import FailedMessages from '../FailedMessages';

interface DeleteSelectedAlertDialogProps
  extends Omit<ActionAlertDialogProps, 'onAction' | 'isLoading'> {
  messageIds: string[];
  topic: string;
  subscription: string;
  onActionSuccess: (data: DeleteSelectedDlqMessagesResponse) => void;
  onActionFailure: (error: AxiosError) => void;
}

const DeleteSelectedAlertDialog: React.FC<DeleteSelectedAlertDialogProps> = ({
  messageIds,
  topic,
  subscription,
  onActionSuccess,
  onActionFailure,
  ...props
}) => {
  const toast = useToast();

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
          if (result.data.failedMessageIds.length) {
            toast({
              duration: 3000,
              isClosable: true,
              // eslint-disable-next-line react/display-name
              render: () => (
                <FailedMessages
                  description="Some selected messages failed to delete."
                  messageIds={result.data.failedMessageIds}
                />
              ),
            });
            return;
          }

          toast({
            title: 'Subscription - DeadLetters.',
            description: 'Selected Messages Deleted successfully!',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        },
        onError: (error: AxiosError) => {
          onActionFailure(error);
          let errorMessage = error.message;
          if (error.response && error.response.data) {
            errorMessage = `${errorMessage}. ${error.response.data.message}`;
          }
          toast({
            title: 'Server Error',
            description: errorMessage || '',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        },
      },
    );
  };

  return (
    <ActionAlertDialog
      {...props}
      isLoading={isLoading}
      onAction={deleteSelectedHandler}
    >
      <Text>
        Deleting requires receiving messages to perform and this increases the
        DeliveryCount of the messages.
      </Text>
      There can be consequences to other messages in this subscription, Are you
      sure? Are you sure you would like to delete selected messages AND increase
      the delivery count.
    </ActionAlertDialog>
  );
};

export default DeleteSelectedAlertDialog;

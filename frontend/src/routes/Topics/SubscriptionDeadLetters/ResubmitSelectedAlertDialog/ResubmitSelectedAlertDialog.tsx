import React, { useMemo } from 'react';
import { Text, Box, useColorMode, useToast } from '@chakra-ui/core';
import { AxiosError } from 'axios';
import ActionAlertDialog, { ActionAlertDialogProps } from 'src/components';
import { ResubmitSelectedDlqMessagesResponse } from '../types';
import { useResubmitSelectedMutation } from '../useResubmitSelectedMutation';
import FailedMessages from '../FailedMessages';

interface ResubmitSelectedAlertDialogProps
  extends Omit<ActionAlertDialogProps, 'onAction' | 'isLoading'> {
  messageIds: string[];
  topic: string;
  subscription: string;
  onActionSuccess: (data: ResubmitSelectedDlqMessagesResponse) => void;
  onActionFailure: (error: AxiosError) => void;
}

const ResubmitSelectedAlertDialog: React.FC<ResubmitSelectedAlertDialogProps> = ({
  messageIds,
  topic,
  subscription,
  onActionSuccess,
  onActionFailure,
  ...props
}) => {
  const toast = useToast();

  const { colorMode } = useColorMode();
  const bg = useMemo(() => (colorMode === 'dark' ? 'gray.600' : 'gray.50'), [
    colorMode,
  ]);

  const {
    mutate: resumbitSelectedMutation,
    isLoading,
  } = useResubmitSelectedMutation(topic, subscription);

  const resumbitSelectedHandler = () => {
    resumbitSelectedMutation(
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
                  description="Some selected messages failed to resubmit."
                  messageIds={result.data.failedMessageIds}
                />
              ),
            });
            return;
          }

          toast({
            title: 'Subscription - DeadLetters.',
            description: 'Selected Messages resubmitted successfully!',
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
      onAction={resumbitSelectedHandler}
    >
      <Text>
        Resubmitting requires receiving messages to perform and this increases
        the DeliveryCount of the messages.
      </Text>
      There can be consequences to other messages in this subscription, Are you
      sure? Are you sure you would like to resubmit selected messages AND
      increase the delivery count.
    </ActionAlertDialog>
  );
};

export default ResubmitSelectedAlertDialog;

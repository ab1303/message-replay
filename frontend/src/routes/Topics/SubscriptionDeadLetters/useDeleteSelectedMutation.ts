import { useContext } from 'react';
import { useMutation } from 'react-query';
import axios, { AxiosError } from 'axios';
import { AppConfigurations } from 'src/types';
import { ConfigContext } from 'src/providers/ConfigProvider';
import {
  DeleteSelectedDlqMessagesResponsePayload,
  DeleteSelectedFormData,
} from './types';

export const useDeleteSelectedMutation = (
  topicName: string,
  subscriptionName: string,
) => {
  const config = useContext<AppConfigurations>(ConfigContext);

  const mutation = useMutation<
    DeleteSelectedDlqMessagesResponsePayload,
    AxiosError,
    DeleteSelectedFormData
  >(formData =>
    axios.post(
      `${config.apiEndpoint}/servicebus/topics/${topicName}/subscriptions/${subscriptionName}/deadletters/delete`,
      {
        topicName,
        subscriptionName,
        messageIds: formData.messageIds,
      },
    ),
  );

  return mutation;
};

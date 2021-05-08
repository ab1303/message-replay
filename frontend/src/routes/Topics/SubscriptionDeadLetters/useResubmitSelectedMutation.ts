import { useContext } from 'react';
import { useMutation } from 'react-query';
import axios, { AxiosError } from 'axios';
import { AppConfigurations } from 'src/types';
import { ConfigContext } from 'src/providers/ConfigProvider';
import {
  ResubmitSelectedDlqMessagesResponsePayload,
  ResubmitSelectedFormData,
} from './types';

export const useResubmitSelectedMutation = (
  topicName: string,
  subscriptionName: string,
) => {
  const config = useContext<AppConfigurations>(ConfigContext);

  const mutation = useMutation<
    ResubmitSelectedDlqMessagesResponsePayload,
    AxiosError,
    ResubmitSelectedFormData
  >(formData =>
    axios.post(
      `${config.apiEndpoint}/servicebus/topics/${topicName}/subscriptions/${subscriptionName}/deadletters/resubmit`,
      {
        topicName,
        subscriptionName,
        messageIds: formData.messageIds,
      },
    ),
  );

  return mutation;
};

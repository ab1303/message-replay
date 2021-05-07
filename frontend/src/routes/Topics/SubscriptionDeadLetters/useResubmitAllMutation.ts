import { useContext } from 'react';
import { useMutation } from 'react-query';
import axios, { AxiosError } from 'axios';
import { AppConfigurations } from 'src/types';
import { ConfigContext } from 'src/providers/ConfigProvider';
import { ResubmitDlqMessagesResponsePayload } from './types';

export const useResubmitAllMutation = (
  topicName: string,
  subscriptionName: string,
) => {
  const config = useContext<AppConfigurations>(ConfigContext);

  const mutation = useMutation<
    ResubmitDlqMessagesResponsePayload,
    AxiosError,
    null
  >(() =>
    axios.post(
      `${config.apiEndpoint}/servicebus/topics/${topicName}/subscriptions/${subscriptionName}/deadletters/resubmitAll`,
      {
        topicName,
        subscriptionName,
      },
    ),
  );

  return mutation;
};

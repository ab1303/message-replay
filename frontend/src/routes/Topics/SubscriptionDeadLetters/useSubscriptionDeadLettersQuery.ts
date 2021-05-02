import { useContext } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { AppConfigurations } from 'src/types';
import { ConfigContext } from 'src/providers/ConfigProvider';
import { SubscriptionDeadLettersQueryResponsePayload } from './types';

export const useSubscriptionDeadLettersQuery = (
  topicName: string,
  subscriptionName: string,
) => {
  const config = useContext<AppConfigurations>(ConfigContext);

  const query = useQuery<SubscriptionDeadLettersQueryResponsePayload>(
    'subscriptionDeadLetters',
    async () => {
      const response = await axios.get<
        SubscriptionDeadLettersQueryResponsePayload
      >(
        `${config.apiEndpoint}/servicebus/topics/${topicName}/subscriptions/${subscriptionName}/deadletters`,
      );
      return response.data;
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  return query;
};

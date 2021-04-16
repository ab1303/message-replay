import { useContext } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { AppConfigurations } from 'src/types';
import { ConfigContext } from 'src/providers/ConfigProvider';
import { SubscriptionsQueryResponsePayload } from './types';

export const useSubscriptionsQuery = (topicName: string) => {
  const config = useContext<AppConfigurations>(ConfigContext);

  const query = useQuery<SubscriptionsQueryResponsePayload>(
    'subscriptions',
    async () => {
      const response = await axios.get<SubscriptionsQueryResponsePayload>(
        `${config.apiEndpoint}/servicebus/topics/${topicName}`,
      );
      return response.data;
    },
  );

  return query;
};

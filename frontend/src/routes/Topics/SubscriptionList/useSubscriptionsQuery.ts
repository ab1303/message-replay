import { useContext } from 'react';
import { useQuery } from 'react-query';
import axios, { AxiosError } from 'axios';
import { AppConfigurations } from 'src/types';
import { ConfigContext } from 'src/providers/ConfigProvider';
import { SubscriptionsQueryResponsePayload } from './types';
import { useToast } from '@chakra-ui/core';

export const useSubscriptionsQuery = (topicName: string) => {
  const config = useContext<AppConfigurations>(ConfigContext);
  const toast = useToast();

  const query = useQuery<SubscriptionsQueryResponsePayload, AxiosError>(
    `subscriptions-${topicName}`,
    async () => {
      const response = await axios.get<SubscriptionsQueryResponsePayload>(
        `${config.apiEndpoint}/servicebus/topics/${topicName}`,
      );
      return response.data;
    },
    {
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

  return query;
};

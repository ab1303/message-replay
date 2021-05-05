import { useContext } from 'react';
import { useQuery } from 'react-query';
import axios, { AxiosError } from 'axios';
import { AppConfigurations } from 'src/types';
import { ConfigContext } from 'src/providers/ConfigProvider';
import { SubscriptionDeadLettersQueryResponsePayload } from './types';
import { useToast } from '@chakra-ui/core';

export const useSubscriptionDeadLettersQuery = (
  topicName: string,
  subscriptionName: string,
) => {
  const config = useContext<AppConfigurations>(ConfigContext);
  const toast = useToast();

  const query = useQuery<
    SubscriptionDeadLettersQueryResponsePayload,
    AxiosError
  >(
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

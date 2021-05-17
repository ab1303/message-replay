import { useContext } from 'react';
import { useQuery } from 'react-query';
import axios, { AxiosError } from 'axios';
import { AppConfigurations } from 'src/types';
import { ConfigContext } from 'src/providers/ConfigProvider';
import { SubscriptionInfoQueryResponsePayload } from './types';
import { useToast } from '@chakra-ui/core';

export const useSubscriptionInfoQuery = (
  topicName: string,
  subscriptionName: string,
) => {
  const config = useContext<AppConfigurations>(ConfigContext);
  const toast = useToast();

  const query = useQuery<SubscriptionInfoQueryResponsePayload, AxiosError>(
    `${topicName}/${subscriptionName}/info`,
    async () => {
      const response = await axios.get<SubscriptionInfoQueryResponsePayload>(
        `${config.apiEndpoint}/servicebus/topics/${topicName}/${subscriptionName}/info`,
      );
      return response.data;
    },
    {
      enabled: false,
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

import { useQuery } from 'react-query';
import axios from 'axios';
import { ResubmitDlqMessagesResponse } from '../types';
import { useContext } from 'react';
import { ConfigContext } from 'src/providers/ConfigProvider';
import { AppConfigurations } from 'src/types';

export const useResubmitStatusQuery = (
  callBackUrl: string,
  timerSeconds: number,
  initialResponse: ResubmitDlqMessagesResponse,
) => {
  const config = useContext<AppConfigurations>(ConfigContext);
  const query = useQuery<ResubmitDlqMessagesResponse>(
    'resubmitStatus',
    async () => {
      const response = await axios.get<ResubmitDlqMessagesResponse>(
        `${config.apiEndpoint}/${callBackUrl}`,
      );
      return response.data;
    },
    {
      refetchOnWindowFocus: false,
      initialData: initialResponse,
      refetchInterval: timerSeconds * 1000,
    },
  );

  return query;
};

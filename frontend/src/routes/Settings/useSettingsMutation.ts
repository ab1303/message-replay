import { useMutation } from 'react-query';
import axios from 'axios';
import { useContext } from 'react';
import { AppConfigurations } from 'src/types';
import { ConfigContext } from 'src/providers/ConfigProvider';
import { SettingsFormData } from './types';

export const useSettingsMutation = () => {
  const config = useContext<AppConfigurations>(ConfigContext);

  const mutation = useMutation<void, unknown, SettingsFormData>(settings =>
    axios.post(`${config.apiEndpoint}/settings`, settings),
  );

  return mutation;
};

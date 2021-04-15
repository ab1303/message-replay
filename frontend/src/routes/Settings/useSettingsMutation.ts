import { useContext } from 'react';
import { useMutation } from 'react-query';
import axios from 'axios';
import { AppConfigurations } from 'src/types';
import { ConfigContext } from 'src/providers/ConfigProvider';
import { SettingsFormData, SettingsMutationResponsePayload } from './types';

export const useSettingsMutation = () => {
  const config = useContext<AppConfigurations>(ConfigContext);

  const mutation = useMutation<
    SettingsMutationResponsePayload,
    unknown,
    SettingsFormData
  >(settings => axios.post(`${config.apiEndpoint}/settings`, settings));

  return mutation;
};

import { AppConfigurations } from './types/AppConfigurations';

export const envConfig = {
  apiEndpoint: process.env.REACT_APP_API_ENDPOINT!,
};

const appConfigurations: AppConfigurations = {
  apiEndpoint: `${envConfig.apiEndpoint}/api`!,
};

export default appConfigurations;

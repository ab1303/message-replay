import React, { createContext } from 'react';
import { AppConfigurations } from 'src/types';

export const ConfigContext = createContext<AppConfigurations>(
  {} as AppConfigurations,
);

interface Props {
  children: React.ReactNode | React.ReactNodeArray;
  appConfig: AppConfigurations;
}

const ConfigProvider: React.FC<Props> = ({ children, appConfig }) => {
  console.log('Configurations:', appConfig);
  console.log('process env', process.env);
  return (
    <ConfigContext.Provider value={appConfig}>
      {children}
    </ConfigContext.Provider>
  );
};

export default ConfigProvider;

import { SettingsMessages, SettingsState } from './routes/Settings/types';
import ActionMap from './utils/actionMap';

export type AppConfigurations = {
  apiEndpoint: string;
};

export type AppState = {
  isLoading: boolean;
  settings: SettingsState;
  entity: {
    queues: string[];
    topics: string[];
  };
};

type ApplicationMessages = SettingsMessages;

export type Actions = ActionMap<ApplicationMessages>[keyof ActionMap<
  ApplicationMessages
>];

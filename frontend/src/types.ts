import { SettingsMessages, SettingsState } from './routes/Settings/types';
import {
  SelectedSubscriptionState,
  SubscriptionListMessages,
} from './routes/Topics/SubscriptionList/types';
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
  selectedSubscription: SelectedSubscriptionState | null;
};

type ApplicationMessages = SettingsMessages & SubscriptionListMessages;

export type Actions = ActionMap<ApplicationMessages>[keyof ActionMap<
  ApplicationMessages
>];

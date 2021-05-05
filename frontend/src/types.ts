import { SettingsMessages, SettingsState } from './routes/Settings/types';
import { SubscriptionDeadLetters } from './routes/Topics/SubscriptionDeadLetters/types';
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

type ApplicationMessages = SettingsMessages &
  SubscriptionListMessages &
  SubscriptionDeadLetters;

export type Actions = ActionMap<ApplicationMessages>[keyof ActionMap<
  ApplicationMessages
>];

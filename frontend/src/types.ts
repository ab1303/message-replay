import { SettingsMessages, SettingsState } from './routes/Settings/types';
import {
  SubscriptionInfo,
  SubscriptionMessages,
} from './routes/Topics/Subscription/types';
import { SubscriptionDeadLettersMessages } from './routes/Topics/SubscriptionDeadLetters/types';
import { SubscriptionListMessages } from './routes/Topics/SubscriptionList/types';
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
  selectedSubscription: SubscriptionInfo | null;
};

type ApplicationMessages = SettingsMessages &
  SubscriptionMessages &
  SubscriptionListMessages &
  SubscriptionDeadLettersMessages;

export type Actions = ActionMap<ApplicationMessages>[keyof ActionMap<
  ApplicationMessages
>];

import { settingsReducer } from './routes/Settings/reducer';
import { SettingsEvent } from './routes/Settings/types';
import { subscriptionListReducer } from './routes/Topics/SubscriptionList/reducer';
import { SubscriptionListEvent } from './routes/Topics/SubscriptionList/types';
import { Actions, AppState } from './types';

export const appReducer = (
  { isLoading, settings, entity, selectedSubscription }: AppState,
  action: Actions,
): AppState => {
  switch (action.type) {
    case SettingsEvent.CONNECTION_CHANGE:
      return {
        isLoading: true,
        settings: settingsReducer(settings, action),
        entity: {
          ...entity,
        },
        selectedSubscription: null,
      };
    case SettingsEvent.CONNECTION_CHANGED:
      return {
        isLoading: false,
        settings: settingsReducer(settings, action),
        entity: {
          queues: action.payload.queues,
          topics: action.payload.topics,
        },
        selectedSubscription: null,
      };
    case SubscriptionListEvent.SUBSCRIPTION_SELECTED:
      return {
        isLoading: false,
        settings: settingsReducer(settings, action),
        entity: entity,
        selectedSubscription: subscriptionListReducer(
          selectedSubscription,
          action,
        ),
      };
    default:
      return {
        isLoading: isLoading,
        settings: settingsReducer(settings, action),
        entity: {
          queues: [],
          topics: [],
        },
        selectedSubscription: subscriptionListReducer(
          selectedSubscription,
          action,
        ),
      };
  }
};

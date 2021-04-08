import { settingsReducer } from './routes/Settings/reducer';
import { SettingsEvent } from './routes/Settings/types';
import { Actions, AppState } from './types';

export const appReducer = (
  { isLoading, settings, entity }: AppState,
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
      };
    case SettingsEvent.CONNECTION_CHANGED:
      return {
        isLoading: false,
        settings: settingsReducer(settings, action),
        entity: {
          queues: action.payload.queues,
          topics: action.payload.topics,
        },
      };
    default:
      return {
        isLoading: isLoading,
        settings: settingsReducer(settings, action),
        entity: {
          queues: [],
          topics: [],
        },
      };
  }
};

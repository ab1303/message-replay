import { settingsReducer } from './routes/Settings/reducer';
import { Actions, AppState } from './types';

export const appReducer = (
  { isLoading, settings, entity }: AppState,
  action: Actions,
): AppState => {
  return {
    isLoading: isLoading,
    settings: settingsReducer(settings, action),
    // TODO: load entity
    entity: {
      queues: [],
      topics: [],
    },
  };
};

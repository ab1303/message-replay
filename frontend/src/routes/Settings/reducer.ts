import { Actions } from 'src/types';
import { SettingsEvent, SettingsState } from './types';

export const settingsReducer = (
  state: SettingsState,
  action: Actions,
): SettingsState => {
  switch (action.type) {
    case SettingsEvent.CONNECTION_CHANGED:
      return {
        connectionString: action.payload.connectionString,
      };
    default:
      return state;
  }
};

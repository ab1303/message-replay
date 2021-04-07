export type SettingsFormData = SettingsState;

export type SettingsState = {
  connectionString: string;
};

export enum SettingsEvent {
  CONNECTION_CHANGE = 'SETTINGS/CONNECTION_CHANGE',
}

export type SettingsMessages = {
  [SettingsEvent.CONNECTION_CHANGE]: {
    connectionString: string;
  };
};

export type SettingsFormData = SettingsState;

export type SettingsMutationResponse = {
  queues: string[];
  topics: string[];
};

export type SettingsMutationResponsePayload = {
  data: SettingsMutationResponse;
};

export type SettingsState = {
  connectionString: string;
};

export enum SettingsEvent {
  CONNECTION_CHANGE = 'SETTINGS/CONNECTION_CHANGE',
  CONNECTION_CHANGED = 'SETTINGS/CONNECTION_CHANGED',
}

export type SettingsMessages = {
  [SettingsEvent.CONNECTION_CHANGE]: {};
  [SettingsEvent.CONNECTION_CHANGED]: {
    connectionString: string;
  } & SettingsMutationResponse;
};

import React, { Dispatch, useReducer } from 'react';
import { appReducer } from 'src/reducer';
import { Actions, AppState } from 'src/types';

const initialAppState: AppState = {
  isLoading: false,
  settings: {
    connectionString: '',
  },
  entity: {
    queues: [],
    topics: [],
  },
};

const AppStateContext = React.createContext<AppState>(initialAppState);

const AppDispatchContext = React.createContext<Dispatch<Actions>>(() => null);

export const AppStateProvider: React.FC<{
  children: React.ReactChild | React.ReactChildren;
}> = ({ children }) => {
  const [appState, dispatch] = useReducer(appReducer, initialAppState);

  return (
    <AppStateContext.Provider value={appState}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};

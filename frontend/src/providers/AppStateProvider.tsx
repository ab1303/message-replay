import React, { Dispatch, useContext, useReducer } from 'react';
import { appReducer } from 'src/reducer';
import { Actions, AppState } from 'src/types';

const initialAppState: AppState = {
  isLoading: false,
  settings: {
    // connectionString: '',
    connectionString:
      'Endpoint=sb://replay-infinitum.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=hUpRvIHz6uJSMzyLI0/4PpQ/oSa+CI9v65CQ/IdwZSA=',
  },
  entity: {
    queues: [],
    topics: [],
  },
  selectedSubscription: null,
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

export const useAppState = () => useContext(AppStateContext);
export const useAppDispatch = () => useContext(AppDispatchContext);

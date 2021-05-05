import React, { Dispatch, useContext, useReducer } from 'react';
import { appReducer } from 'src/reducer';
import { Actions, AppState } from 'src/types';

// TODO Reset State
const initialAppState: AppState = {
  isLoading: false,
  settings: {
    connectionString: '',
  },
  entity: {
    queues: [],
    topics: [],
  },
  selectedSubscription: null,
};

// Uncomment to Load State quickly
// const initialAppState: AppState = {
//   isLoading: false,
//   settings: {
//     connectionString:
//       'Endpoint=sb://replay-infinitum.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=hUpRvIHz6uJSMzyLI0/4PpQ/oSa+CI9v65CQ/IdwZSA=',
//   },
//   entity: {
//     queues: [],
//     topics: ['replay-poc-topic'],
//   },
//   selectedSubscription: {
//     activeMessageCount: 0,
//     createdAt: '2021-03-18T10:54:48.2479522+11:00',
//     deadLetterMessageCount: 167,
//     name: 'replay-poc-subscription',
//   },
// };

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

import React from 'react';
import { ThemeProvider, ColorModeProvider, CSSReset } from '@chakra-ui/core';
import { Global, css } from '@emotion/core';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import SiteTemplate from 'src/templates/SiteTemplate';
import { THEME } from 'src/styles';
import appConfigurations from 'src/config';
import ConfigProvider from 'src/providers/ConfigProvider';
import { AppStateProvider } from './providers/AppStateProvider';
import { ErrorBoundary } from './components/ErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
});
const App: React.FC = () => {
  return (
    <ThemeProvider theme={THEME}>
      <ColorModeProvider value="light">
        <CSSReset />

        <Global
          styles={css`
            html {
              width: 100%;
              height: 100%;
            }

            html,
            body,
            #root {
              display: flex;
              flex-direction: column;
              flex: 1;
            }
          `}
        />

        <QueryClientProvider client={queryClient}>
          <ErrorBoundary>
            <ConfigProvider appConfig={appConfigurations}>
              <AppStateProvider>
                <Router basename={process.env.PUBLIC_URL}>
                  <Route component={SiteTemplate} />
                </Router>
              </AppStateProvider>
              <ReactQueryDevtools
                initialIsOpen={false}
                position="bottom-right"
              />
            </ConfigProvider>
          </ErrorBoundary>
        </QueryClientProvider>
      </ColorModeProvider>
    </ThemeProvider>
  );
};

export default App;

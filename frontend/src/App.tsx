import React from 'react';
import { ThemeProvider, ColorModeProvider, CSSReset } from '@chakra-ui/core';
import { Global, css } from '@emotion/core';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import SiteTemplate from 'src/templates/SiteTemplate';
import { THEME } from 'src/styles';
import appConfigurations from 'src/config';
import ConfigProvider from 'src/providers/configProvider/ConfigProvider';

const queryClient = new QueryClient();
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
          <ConfigProvider appConfig={appConfigurations}>
            <Router basename={process.env.PUBLIC_URL}>
              <Route component={SiteTemplate} />
            </Router>
            <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
          </ConfigProvider>
        </QueryClientProvider>
      </ColorModeProvider>
    </ThemeProvider>
  );
};

export default App;

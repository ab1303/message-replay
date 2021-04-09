import React, { useMemo } from 'react';
import { Box, useColorMode } from '@chakra-ui/core';
import { Switch, Route, Redirect } from 'react-router-dom';

import { Path, routeTo } from 'src/router';
import Home from 'src/routes/Home';
import Settings from 'src/routes/Settings';
import Users from 'src/routes/Users';
import { useAppState } from 'src/providers/AppStateProvider';
import SubscriptionList from 'src/routes/Topics/SubscriptionList';

const Content: React.FC = () => {
  const { colorMode } = useColorMode();

  const bg = useMemo(() => (colorMode === 'dark' ? 'gray.600' : 'gray.50'), [
    colorMode,
  ]);

  const appState = useAppState();
  const {
    entity: { queues, topics },
  } = appState;

  return (
    <Box ml={[0, null, '18rem']} mt="4rem" height="full" bg={bg}>
      <Box
        as="main"
        mx="auto"
        py={['2rem', '2.5rem', '3rem']}
        px={['2rem', '2.5rem', '3rem']}
      >
        <Switch>
          <Route exact path={routeTo(Path.Settings)} component={Settings} />
          <Route exact path={routeTo(Path.PROFILE)} component={Home} />
          <Route path={routeTo(Path.USERS_ROOT)} component={Users} />
          <Route exact path="/">
            <Redirect to={routeTo(Path.Settings)} />
          </Route>
          {!!topics.length &&
            topics.map(topic => {
              return (
                <Route
                  key={topic}
                  exact
                  path={`${Path.MESSAGE_BROKER_TOPICS}/:topic`}
                  component={SubscriptionList}
                />
              );
            })}
        </Switch>
      </Box>
    </Box>
  );
};

export default Content;

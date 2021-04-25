import { Tab, TabList, TabPanels, Tabs } from '@chakra-ui/core';
import React from 'react';
import { NavLink, useRouteMatch, Route, Switch } from 'react-router-dom';
import { useAppState } from 'src/providers/AppStateProvider';

import SubscriptionDeadLetters from '../SubscriptionDeadLetters';
import SubscriptionMessages from '../SubscriptionMessages';

const SubscriptionList: React.FC = () => {
  const match = useRouteMatch();
  const { selectedSubscription } = useAppState();
  if (!match || !selectedSubscription) return null;
  const url = window.location.href;

  const tabDefaultIndex = url.indexOf('deadletters') > 0 ? 1 : 0;

  return (
    // @ts-ignore
    <Tabs defaultIndex={tabDefaultIndex}>
      <TabList>
        <Tab>
          <NavLink to={`${match.url}/messages`}>
            Messages - ({selectedSubscription.activeMessageCount})
          </NavLink>
        </Tab>
        <Tab>
          <NavLink to={`${match.url}/deadletters`}>
            Dead Letters - ({selectedSubscription.deadLetterMessageCount})
          </NavLink>
        </Tab>
      </TabList>
      <TabPanels>
        <Switch>
          <Route path={`${match.path}/messages`}>
            <SubscriptionMessages />
          </Route>
          <Route path={`${match.path}/deadletters`}>
            <SubscriptionDeadLetters />
          </Route>
        </Switch>
      </TabPanels>
    </Tabs>
  );
};

SubscriptionList.displayName = 'SubscriptionList';

export default SubscriptionList;

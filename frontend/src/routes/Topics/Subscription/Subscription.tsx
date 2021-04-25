import { Tab, TabList, TabPanels, Tabs } from '@chakra-ui/core';
import React from 'react';
import { Link, useRouteMatch, Route, Switch } from 'react-router-dom';
import { useAppState } from 'src/providers/AppStateProvider';

import SubscriptionDeadLetters from '../SubscriptionDeadLetters';
import SubscriptionMessages from '../SubscriptionMessages';

const SubscriptionList: React.FC = () => {
  const match = useRouteMatch();
  const { selectedSubscription } = useAppState();
  if (!match || !selectedSubscription) return null;

  return (
    <Tabs>
      <TabList>
        <Tab>
          <Link to={`${match.url}/messages`}>
            Messages - ({selectedSubscription.activeMessageCount})
          </Link>
        </Tab>
        <Tab>
          <Link to={`${match.url}/deadletters`}>
            Dead Letters - ({selectedSubscription.deadLetterMessageCount})
          </Link>
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

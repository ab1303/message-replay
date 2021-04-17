import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/core';
import React from 'react';
import { Link, useRouteMatch, Route, Switch } from 'react-router-dom';

import SubscriptionDeadLetters from '../SubscriptionDeadLetters';
import SubscriptionMessages from '../SubscriptionMessages';

const SubscriptionList: React.FC = () => {
  const match = useRouteMatch();

  if (!match) return null;

  return (
    <Tabs>
      <TabList>
        <Tab>
          <Link to={`${match.url}/messages`}>Messages</Link>
        </Tab>
        <Tab>
          <Link to={`${match.url}/deadletters`}>Dead Letters</Link>
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

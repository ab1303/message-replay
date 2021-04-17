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
        <Tab>Messages</Tab>
        <Tab>Dead Letters</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <SubscriptionMessages />
        </TabPanel>
        <TabPanel>
          <SubscriptionDeadLetters />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

SubscriptionList.displayName = 'SubscriptionList';

export default SubscriptionList;

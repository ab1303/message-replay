import {
  Flex,
  Heading,
  Stack,
  Tab,
  TabList,
  TabPanels,
  Tabs,
  Tooltip,
  IconButton,
} from '@chakra-ui/core';
import React, { useEffect } from 'react';
import {
  NavLink,
  useRouteMatch,
  Route,
  Switch,
  useParams,
} from 'react-router-dom';
import { useAppDispatch, useAppState } from 'src/providers/AppStateProvider';

import { useSubscriptionInfoQuery } from './useSubscriptionInfoQuery';
import SubscriptionDeadLetters from '../SubscriptionDeadLetters';
import SubscriptionMessages from '../SubscriptionMessages';
import { SubscriptionEvent } from './types';

const SubscriptionList: React.FC = () => {
  const appDispatch = useAppDispatch();
  const match = useRouteMatch();
  const { topic, subscription } = useParams<{
    topic: string;
    subscription: string;
  }>();
  const { selectedSubscription } = useAppState();
  const { data, refetch, isFetching } = useSubscriptionInfoQuery(
    topic,
    subscription,
  );

  useEffect(() => {
    if (isFetching || !data) return;

    appDispatch({
      type: SubscriptionEvent.INFO_REFRESH,
      payload: {
        subscription: data,
      },
    });
  }, [isFetching, data]);

  if (!match || !selectedSubscription) return null;
  const url = window.location.href;

  const tabIndex = url.indexOf('deadletters') > 0 ? 1 : 0;

  return (
    // @ts-ignore
    <Stack spacing={3}>
      <Heading as="h2" size="lg" color="main.500">
        <Flex align="center" justify="space-between">
          {selectedSubscription.name}
          <Tooltip
            aria-label="refresh-subscription-count-tooltip"
            label="Refresh Subscription Counts"
            placement="top"
          >
            <IconButton
              aria-label="refresh-subscription-count-button"
              icon="repeat"
              onClick={() => refetch()}
            />
          </Tooltip>
        </Flex>
      </Heading>
      <Tabs index={tabIndex} isManual>
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
    </Stack>
  );
};

SubscriptionList.displayName = 'SubscriptionList';

export default SubscriptionList;

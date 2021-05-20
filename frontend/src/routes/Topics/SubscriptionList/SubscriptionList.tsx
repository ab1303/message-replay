import React from 'react';
import { useParams, Link } from 'react-router-dom';
import dateformat from 'dateformat';

import { Card, Table } from 'src/components';
import { Path } from 'src/router';
import { useSubscriptionsQuery } from './useSubscriptionsQuery';
import { DATE_FORMAT } from 'src/constants';
import { useAppDispatch } from 'src/providers/AppStateProvider';
import { SubscriptionListEvent } from './types';
import { SubscriptionInfo } from '../Subscription/types';

const SubscriptionList: React.FC = () => {
  const appDispatch = useAppDispatch();
  const { topic } = useParams<{ topic: string }>();
  const { data, isFetched } = useSubscriptionsQuery(topic);

  const selectSubscriptionHandler = (subscription: SubscriptionInfo) =>
    appDispatch({
      type: SubscriptionListEvent.SUBSCRIPTION_SELECTED,
      payload: subscription,
    });

  return (
    <Card>
      <Card.Header>
        <Card.Header.Title>Topic Subscriptions</Card.Header.Title>
      </Card.Header>

      <Table>
        <Table.THead>
          <Table.THead.TR>
            <Table.THead.TH>Name</Table.THead.TH>
            <Table.THead.TH>Active Messages</Table.THead.TH>
            <Table.THead.TH>DeadLetters</Table.THead.TH>
            <Table.THead.TH>Created At</Table.THead.TH>
          </Table.THead.TR>
        </Table.THead>

        {isFetched && !!data && data.subscriptions && (
          <Table.TBody>
            {data.subscriptions.map(subscription => {
              const subscriptionPath = `${Path.MESSAGE_BROKER_TOPICS}/${topic}/subscriptions/${subscription.name}/messages`;
              return (
                <Table.TBody.TR key={subscription.name}>
                  <Table.TBody.TD>
                    <Link
                      onClick={() => selectSubscriptionHandler(subscription)}
                      to={subscriptionPath}
                    >
                      {subscription.name}
                    </Link>
                  </Table.TBody.TD>
                  <Table.TBody.TD>
                    {subscription.activeMessageCount}
                  </Table.TBody.TD>
                  <Table.TBody.TD>
                    {subscription.deadLetterMessageCount}
                  </Table.TBody.TD>
                  <Table.TBody.TD>
                    {dateformat(subscription.createdAt, DATE_FORMAT)}
                  </Table.TBody.TD>
                </Table.TBody.TR>
              );
            })}
          </Table.TBody>
        )}
      </Table>
    </Card>
  );
};

export default SubscriptionList;

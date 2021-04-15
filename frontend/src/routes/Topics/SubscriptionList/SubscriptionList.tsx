import React from 'react';
import { useParams } from 'react-router-dom';

import { Card, Table } from 'src/components';
import { useSubscriptionsQuery } from './useSubscriptionsQuery';

const SubscriptionList: React.FC = () => {
  const { topic } = useParams<{ topic: string }>();

  const { data, isLoading } = useSubscriptionsQuery();

  if (!isLoading) {
    console.log('data from response', data);
  }

  return (
    <Card>
      <Card.Header>
        <Card.Header.Title>Topic Subscriptions</Card.Header.Title>
      </Card.Header>

      <Table>
        <Table.THead>
          <Table.THead.TR>
            <Table.THead.TH>Name</Table.THead.TH>
            <Table.THead.TH>Max Delivery Count</Table.THead.TH>
          </Table.THead.TR>
        </Table.THead>

        {!isLoading && !!data && (
          <Table.TBody>
            {data.subscriptions.map(subscription => (
              <Table.TBody.TR key={subscription.name}>
                <Table.TBody.TD>{subscription.name}</Table.TBody.TD>
                <Table.TBody.TD>{subscription.maxDeliveryCount}</Table.TBody.TD>
              </Table.TBody.TR>
            ))}
          </Table.TBody>
        )}
      </Table>
    </Card>
  );
};

export default SubscriptionList;

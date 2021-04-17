import React from 'react';
import { useParams } from 'react-router-dom';

import { Card, Table } from 'src/components';
import { useSubscriptionMessagesQuery } from './useSubscriptionMessagesQuery';

const SubscriptionMessages: React.FC = () => {
  const { topic, subscription } = useParams<{
    topic: string;
    subscription: string;
  }>();
  const { data, isFetched } = useSubscriptionMessagesQuery(topic, subscription);
  return (
    <Card>
      <Card.Header>
        <Card.Header.Title>Subscription Messages</Card.Header.Title>
      </Card.Header>

      <Table>
        <Table.THead>
          <Table.THead.TR>
            <Table.THead.TH>Message Id</Table.THead.TH>
            <Table.THead.TH>Subject</Table.THead.TH>
          </Table.THead.TR>
        </Table.THead>

        {isFetched && !!data && data.messages && (
          <Table.TBody>
            {data.messages.map(subscription => {
              return (
                <Table.TBody.TR key={subscription.messageId}>
                  <Table.TBody.TD>{subscription.messageId}</Table.TBody.TD>
                  <Table.TBody.TD>{subscription.subject}</Table.TBody.TD>
                </Table.TBody.TR>
              );
            })}
          </Table.TBody>
        )}
      </Table>
    </Card>
  );
};

export default SubscriptionMessages;

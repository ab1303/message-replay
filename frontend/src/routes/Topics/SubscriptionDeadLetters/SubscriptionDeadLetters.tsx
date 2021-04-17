import React from 'react';
import { useParams } from 'react-router-dom';

import { Card, Table } from 'src/components';
import { useSubscriptionDeadLettersQuery } from './useSubscriptionDeadLettersQuery';

const SubscriptionDeadLetters: React.FC = () => {
  const { topic, subscription } = useParams<{
    topic: string;
    subscription: string;
  }>();
  const { data, isFetched } = useSubscriptionDeadLettersQuery(
    topic,
    subscription,
  );

  return (
    <Card>
      <Card.Header>
        <Card.Header.Title>Subscription Dead Letters</Card.Header.Title>
      </Card.Header>

      <Table>
        <Table.THead>
          <Table.THead.TR>
            <Table.THead.TH>Message Id</Table.THead.TH>
            <Table.THead.TH>Subject</Table.THead.TH>
          </Table.THead.TR>
        </Table.THead>

        {isFetched && !!data && data.deadLetters && (
          <Table.TBody>
            {data.deadLetters.map(deadLetter => {
              return (
                <Table.TBody.TR key={deadLetter.messageId}>
                  <Table.TBody.TD>{deadLetter.messageId}</Table.TBody.TD>
                  <Table.TBody.TD>{deadLetter.subject}</Table.TBody.TD>
                </Table.TBody.TR>
              );
            })}
          </Table.TBody>
        )}
      </Table>
    </Card>
  );
};

SubscriptionDeadLetters.displayName = 'SubscriptionDeadLetters';

export default SubscriptionDeadLetters;

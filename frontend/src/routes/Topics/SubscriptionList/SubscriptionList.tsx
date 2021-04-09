import React from 'react';
import { useParams } from 'react-router-dom';

import { Card, Table } from 'src/components';

const SubscriptionList: React.FC = () => {
  const { topic } = useParams<{ topic: string }>();

  console.log('topic name', topic);

  return (
    <Card>
      <Card.Header>
        <Card.Header.Title>Users</Card.Header.Title>
        <Card.Header.Text>Listing all users</Card.Header.Text>
      </Card.Header>
    </Card>
  );
};

export default SubscriptionList;

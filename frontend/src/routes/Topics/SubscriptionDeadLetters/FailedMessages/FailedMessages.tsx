import React, { useMemo } from 'react';
import { Box, Text, useColorMode } from '@chakra-ui/core';
import { Card } from 'src/components';

type FailedMessagesProps = { description: string; messageIds: string[] };

const FailedMessages: React.FC<FailedMessagesProps> = ({
  description,
  messageIds,
}) => {
  const { colorMode } = useColorMode();
  const bg = useMemo(() => (colorMode === 'dark' ? 'gray.600' : 'gray.50'), [
    colorMode,
  ]);
  return (
    <Card>
      <Text>Failed Messages</Text>
      <Card.Body>
        <Text>{description}</Text>
        <Box bg={bg} w="100%" p={4} h={400}>
          <ol>
            {messageIds.map(id => (
              <li key={id}>{id}</li>
            ))}
          </ol>
        </Box>
      </Card.Body>
    </Card>
  );
};

FailedMessages.displayName = 'FailedMessages';

export default FailedMessages;

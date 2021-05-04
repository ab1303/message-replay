import React, { useEffect, useMemo } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  useDisclosure,
  Box,
  Badge,
  Stack,
  Text,
  Flex,
  Divider,
  useColorMode,
} from '@chakra-ui/core';
import Card from '../Card';
import { ResubmitDlqMessagesResponse } from 'src/routes/Topics/SubscriptionDeadLetters/types';

interface MessageModalProps {
  openResubmitStatusModal: boolean;
  closeResubmitStatusModal: () => void;
  modalState: ResubmitDlqMessagesResponse;
}

const ResubmitStatusModal: React.FC<MessageModalProps> = ({
  modalState,
  openResubmitStatusModal,
}) => {
  const { subscription, callBackAfter } = modalState;
  const { isOpen, onOpen } = useDisclosure();
  const { colorMode } = useColorMode();

  const bg = useMemo(() => (colorMode === 'dark' ? 'gray.600' : 'gray.50'), [
    colorMode,
  ]);

  useEffect(() => {
    if (openResubmitStatusModal) onOpen();
  }, [openResubmitStatusModal]);

  return (
    <Modal blockScrollOnMount isOpen={isOpen} onClose={() => {}}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader> {subscription.name} status</ModalHeader>
        <Card>
          <Text px={5} py={3}>
            Refreshing in {callBackAfter}
          </Text>
          <ModalBody>
            <Card.Body>
              <Stack bg={bg} p={5}>
                <Flex>
                  <Text mr={5} width="300px" as="span">
                    Active Messages
                  </Text>
                  {subscription.activeMessageCount}
                </Flex>
                <Flex>
                  <Text mr={5} width="300px" as="span">
                    Dead Letters
                  </Text>
                  {subscription.deadLetterMessageCount}
                </Flex>
              </Stack>
            </Card.Body>
          </ModalBody>
        </Card>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

ResubmitStatusModal.displayName = 'ResubmitStatusModal';

export default ResubmitStatusModal;

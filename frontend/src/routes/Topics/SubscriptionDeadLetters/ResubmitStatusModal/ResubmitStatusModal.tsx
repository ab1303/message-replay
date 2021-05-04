import React, { useEffect, useMemo } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  useDisclosure,
  Stack,
  Text,
  useColorMode,
} from '@chakra-ui/core';
import Card from '../../../../components/Card';
import { ResubmitDlqMessagesResponse } from 'src/routes/Topics/SubscriptionDeadLetters/types';
import { useState } from 'react';
import { toHHMMSS, toSeconds } from 'src/utils/timeInterval';
import StatCard from 'src/routes/Home/components/StatCard';
import { useResubmitStatusQuery } from './useResubmitStatusQuery';
import { DefaultSpinner } from 'src/components';
import { useInterval } from 'src/hooks/useInterval';

interface MessageModalProps {
  openResubmitStatusModal: boolean;
  closeResubmitStatusModal: () => void;
  resubmitDlqMessagesResponse: ResubmitDlqMessagesResponse;
}

const ResubmitStatusModal: React.FC<MessageModalProps> = ({
  resubmitDlqMessagesResponse,
  openResubmitStatusModal,
  closeResubmitStatusModal,
}) => {
  const { isOpen, onOpen } = useDisclosure();
  const { colorMode } = useColorMode();

  const {
    subscription: originalSubscriptionDetails,
    callBackAfter,
    callBackUrl,
  } = resubmitDlqMessagesResponse;

  const timeSeconds = toSeconds(callBackAfter);

  const { data, isFetching } = useResubmitStatusQuery(
    callBackUrl,
    timeSeconds,
    resubmitDlqMessagesResponse,
  );

  const [timerSeconds, setTimerSeconds] = useState<number>(
    toSeconds(!data ? '00:00:00' : data.callBackAfter),
  );

  useInterval(() => {
    if (!timerSeconds) return;
    setTimerSeconds(timerSeconds - 1);
  }, 1000);

  useEffect(() => {
    if (!data) return;
    setTimerSeconds(toSeconds(data.callBackAfter));

    if (data.subscription.deadLetterMessageCount === 0) {
      closeResubmitStatusModal();
    }
  }, [isFetching]);

  const bg = useMemo(() => (colorMode === 'dark' ? 'gray.600' : 'gray.50'), [
    colorMode,
  ]);

  useEffect(() => {
    if (openResubmitStatusModal) onOpen();
  }, [openResubmitStatusModal]);

  console.log('data response:', data);

  return (
    <Modal blockScrollOnMount isOpen={isOpen} onClose={() => {}}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader> {originalSubscriptionDetails.name} status</ModalHeader>
        <Card>
          <Text px={5} py={3}>
            Refreshing in {toHHMMSS(timerSeconds)}
          </Text>
          <ModalBody>
            <Card.Body>
              {!data || isFetching ? (
                <DefaultSpinner />
              ) : (
                <Stack bg={bg} p={5}>
                  <StatCard
                    icon={{ name: 'email', color: 'green.500' }}
                    title="Active Messages"
                    value={`${data.subscription.activeMessageCount}`}
                  />

                  <StatCard
                    icon={{ name: 'email', color: 'red.100' }}
                    title="Dead Letters"
                    value={`${data.subscription.deadLetterMessageCount}`}
                  />
                </Stack>
              )}
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

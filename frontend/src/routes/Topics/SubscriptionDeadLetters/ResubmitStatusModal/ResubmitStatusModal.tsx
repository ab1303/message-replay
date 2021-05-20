import React, { useEffect, useMemo, useState } from 'react';
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
  useToast,
  Flex,
} from '@chakra-ui/core';

import { MdAlarm } from 'react-icons/md';

import Card from '../../../../components/Card';
import { ResubmitDlqMessagesResponse } from 'src/routes/Topics/SubscriptionDeadLetters/types';
import { toHHMMSS, toSeconds } from 'src/utils/timeInterval';
import StatCard from 'src/routes/Home/components/StatCard';
import { useResubmitStatusQuery } from './useResubmitStatusQuery';
import { DefaultSpinner } from 'src/components';
import { useInterval } from 'src/hooks/useInterval';
import { SubscriptionEvent, SubscriptionInfo } from '../../Subscription/types';
import { useAppDispatch } from 'src/providers/AppStateProvider';

interface MessageModalProps {
  openResubmitStatusModal: boolean;
  closeResubmitStatusModal: (updatedSubscription: SubscriptionInfo) => void;
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

  const toast = useToast();
  const appDispatch = useAppDispatch();

  const [timerSeconds, setTimerSeconds] = useState<number>(
    toSeconds(!data ? '00:00:00' : data.callBackAfter),
  );

  useInterval(() => {
    if (!timerSeconds) return;
    setTimerSeconds(timerSeconds - 1);
  }, 1000);

  useEffect(() => {
    if (isFetching || !data) return;
    setTimerSeconds(toSeconds(data.callBackAfter));

    appDispatch({
      type: SubscriptionEvent.INFO_REFRESH,
      payload: {
        subscription: data.subscription,
      },
    });

    if (!data.inProgress) {
      closeResubmitStatusModal(data.subscription);
      if (data.subscription.deadLetterMessageCount === 0) {
        toast({
          title: 'Subscription - DeadLetters.',
          description: 'Request successfully processed by server',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  }, [isFetching]);

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
        <ModalHeader>
          {originalSubscriptionDetails.name.toUpperCase()} status
        </ModalHeader>
        <Card>
          <Stack
            isInline
            mt={3}
            spacing={5}
            justifyContent="center"
            alignItems="center"
          >
            <Text py={3}>Refreshing status in </Text>

            <Flex direction="row" alignItems="center">
              <MdAlarm size="30px" style={{ marginRight: '5px' }} />
              {toHHMMSS(timerSeconds)}
            </Flex>
          </Stack>
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

import React, { useEffect } from 'react';
import JSONPretty from 'react-json-pretty';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/core';
import Card from '../Card';
import { Table } from '..';
import { SubscriptionDeadLettersQueryResponse } from 'src/routes/Topics/SubscriptionDeadLetters/types';
import { SubscriptionMessagesQueryResponse } from 'src/routes/Topics/SubscriptionMessages/types';

type responseType =
  | SubscriptionDeadLettersQueryResponse
  | SubscriptionMessagesQueryResponse;

interface MessageModalProps {
  message: responseType | null;
  displayProps: Array<keyof responseType>;
  openMessageModal: boolean;
  onCloseMessageModal: () => void;
}

const MessageModal: React.FC<MessageModalProps> = ({
  message,
  displayProps,
  openMessageModal,
  onCloseMessageModal,
}) => {
  const getMessageProp = (obj: responseType, key: keyof responseType) =>
    obj[key];

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (openMessageModal) onOpen();
  }, [openMessageModal]);

  return (
    <Modal
      blockScrollOnMount
      isOpen={isOpen}
      onClose={() => {
        onCloseMessageModal();
        onClose();
      }}
      size="3xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Message Payload</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Card>
            <Table>
              <Table.TBody>
                {message &&
                  displayProps.map((prop: keyof responseType) => (
                    <Table.TBody.TR key={prop}>
                      <Table.TBody.TD>{prop}</Table.TBody.TD>
                      <Table.TBody.TD>
                        {prop === 'content' ? (
                          <JSONPretty
                            id="json-pretty"
                            data={message.content}
                          ></JSONPretty>
                        ) : (
                          getMessageProp(message, prop)
                        )}
                      </Table.TBody.TD>
                    </Table.TBody.TR>
                  ))}
              </Table.TBody>
            </Table>
          </Card>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

MessageModal.displayName = 'MessageModal';

export default MessageModal;

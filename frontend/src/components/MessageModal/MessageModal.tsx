import React from 'react';
import JSONPretty from 'react-json-pretty';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  IModal,
} from '@chakra-ui/core';
import Card from '../Card';
import { Table } from '..';
import { SubscriptionDeadLettersQueryResponse } from 'src/routes/Topics/SubscriptionDeadLetters/types';
import { SubscriptionMessagesQueryResponse } from 'src/routes/Topics/SubscriptionMessages/types';

type responseType =
  | SubscriptionDeadLettersQueryResponse
  | SubscriptionMessagesQueryResponse;

interface MessageModalProps extends Pick<IModal, 'isOpen' | 'onClose'> {
  message: responseType | null;
  displayProps: Array<keyof responseType>;
}

const MessageModal: React.FC<MessageModalProps> = ({
  isOpen,
  onClose,
  message,
  displayProps,
}) => {
  const getMessageProp = (obj: responseType, key: keyof responseType) =>
    obj[key];

  return (
    <Modal blockScrollOnMount isOpen={isOpen} onClose={onClose}>
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

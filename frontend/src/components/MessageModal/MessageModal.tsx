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
  Button,
  IModal,
} from '@chakra-ui/core';
import Card from '../Card';

interface MessageModalProps extends Pick<IModal, 'isOpen' | 'onClose'> {
  payload: string;
}

const MessageModal: React.FC<MessageModalProps> = ({
  isOpen,
  onClose,
  payload,
}) => {
  return (
    <Modal blockScrollOnMount isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Message Payload</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Card>
            <JSONPretty id="json-pretty" data={payload}></JSONPretty>
          </Card>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

MessageModal.displayName = 'MessageModal';

export default MessageModal;

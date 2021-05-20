import { SubscriptionInfo } from '../Subscription/types';

export type SubscriptionDeadLettersQueryResponse = {
  messageId: string;
  content: string;
  sequenceNumber: number;
  size: number;
  deliveryCount: number;
  deadLetterReason: string;
  isDlq: boolean;
};

export type SubscriptionDeadLettersQueryResponsePayload = {
  deadLetters: SubscriptionDeadLettersQueryResponse[];
};

export type DeleteSelectedFormData = {
  messageIds: string[];
};

export type ResubmitSelectedFormData = DeleteSelectedFormData;

export type DeleteSelectedDlqMessagesResponsePayload = {
  data: DeleteSelectedDlqMessagesResponse;
};

export type ResubmitSelectedDlqMessagesResponsePayload = {
  data: ResubmitSelectedDlqMessagesResponse;
};

export type DeleteSelectedDlqMessagesResponse = {
  failedMessageIds: string[];
  lockedUntilUtc: string;
};

export type ResubmitSelectedDlqMessagesResponse = DeleteSelectedDlqMessagesResponse;

export type ResubmitDlqMessagesResponsePayload = {
  data: ResubmitDlqMessagesResponse;
};

export type ResubmitDlqMessagesStatusResponsePayload = {
  response: ResubmitDlqMessagesResponse;
};

export type ResubmitDlqMessagesResponse = {
  processId: string;
  callBackAfter: string;
  inProgress: boolean;
  subscription: SubscriptionInfo;
  callBackUrl: string;
};

export enum SubscriptionDeadLettersEvent {
  RESUBMIT_ALL_PROCESSED = 'SubscriptionDeadLetters/RESUBMIT_ALL_PROCESSED',
}

export type SubscriptionDeadLettersMessages = {
  [SubscriptionDeadLettersEvent.RESUBMIT_ALL_PROCESSED]: {
    subscription: SubscriptionInfo;
  };
};

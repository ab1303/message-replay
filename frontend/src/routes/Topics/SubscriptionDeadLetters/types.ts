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

export type DeleteSelectedDlqMessagesResponsePayload = {
  data: DeleteSelectedDlqMessagesResponse;
};

export type DeleteSelectedDlqMessagesResponse = {
  failedMessageIds: string[];
  lockedUntilUtc: string;
};

export type ResubmitDlqMessagesResponsePayload = {
  data: ResubmitDlqMessagesResponse;
};

export type ResubmitDlqMessagesResponse = {
  processId: string;
  callBackAfter: string;
  inProgress: boolean;
  subscription: {
    name: string;
    activeMessageCount: number;
    deadLetterMessageCount: number;
    createdAt: string;
  };
  callBackUrl: string;
};

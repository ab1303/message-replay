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

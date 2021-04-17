type SubscriptionDeadLettersQueryResponse = {
  messageId: string;
  subject: string;
  sequenceNumber: number;
  enqueuedTime: Date;
  expiresAt: Date;
};

export type SubscriptionDeadLettersQueryResponsePayload = {
  deadLetters: SubscriptionDeadLettersQueryResponse[];
};

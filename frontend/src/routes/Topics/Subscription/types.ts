export type SubscriptionMessagesQueryResponse = {
  messageId: string;
  subject: string;
  sequenceNumber: number;
  enqueuedTime: Date;
  expiresAt: Date;
};

export type SubscriptionMessagesQueryResponsePayload = {
  messages: SubscriptionMessagesQueryResponse[];
};

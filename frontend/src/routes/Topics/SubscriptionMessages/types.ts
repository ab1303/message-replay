export type SubscriptionMessagesQueryResponse = {
  messageId: string;
  content: string;
  sequenceNumber: number;
  size: number;
  deliveryCount: number;
  isDlq: boolean;
};

export type SubscriptionMessagesQueryResponsePayload = {
  messages: SubscriptionMessagesQueryResponse[];
};

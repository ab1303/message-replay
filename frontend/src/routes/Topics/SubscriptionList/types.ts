export type SubscriptionsQueryResponse = {
  name: string;
  activeMessageCount: number;
  deadLetterMessageCount: number;
  createdAt: string;
};

export type SubscriptionsQueryResponsePayload = {
  subscriptions: SubscriptionsQueryResponse[];
};

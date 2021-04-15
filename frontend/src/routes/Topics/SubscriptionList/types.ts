export type SubscriptionsQueryResponse = {
  name: string;
  maxDeliveryCount: number;
};

export type SubscriptionsQueryResponsePayload = {
  subscriptions: SubscriptionsQueryResponse[];
};

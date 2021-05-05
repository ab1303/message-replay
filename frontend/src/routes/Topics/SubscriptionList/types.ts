export type Subscription = {
  name: string;
  activeMessageCount: number;
  deadLetterMessageCount: number;
  createdAt: string;
};

export type SubscriptionsQueryResponse = Subscription;

export type SubscriptionsQueryResponsePayload = {
  subscriptions: SubscriptionsQueryResponse[];
};

export type SelectedSubscriptionState = SubscriptionsQueryResponse;

export enum SubscriptionListEvent {
  SUBSCRIPTION_SELECTED = 'SUBSCRIPTION/SUBSCRIPTION_SELECTED',
}

export type SubscriptionListMessages = {
  [SubscriptionListEvent.SUBSCRIPTION_SELECTED]: SelectedSubscriptionState;
};

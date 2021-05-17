import { SubscriptionInfo } from '../Subscription/types';

export type SubscriptionsQueryResponse = SubscriptionInfo;

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

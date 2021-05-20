import { SubscriptionInfo } from '../Subscription/types';

export type SubscriptionsQueryResponsePayload = {
  subscriptions: SubscriptionInfo[];
};

export enum SubscriptionListEvent {
  SUBSCRIPTION_SELECTED = 'SUBSCRIPTION/SUBSCRIPTION_SELECTED',
}

export type SubscriptionListMessages = {
  [SubscriptionListEvent.SUBSCRIPTION_SELECTED]: SubscriptionInfo;
};

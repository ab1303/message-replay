import { Actions } from 'src/types';
import { SubscriptionInfo } from '../Subscription/types';
import { SubscriptionListEvent } from './types';

export const subscriptionListReducer = (
  state: SubscriptionInfo | null,
  action: Actions,
): SubscriptionInfo | null => {
  switch (action.type) {
    case SubscriptionListEvent.SUBSCRIPTION_SELECTED:
      return {
        ...action.payload,
      };

    default:
      return state;
  }
};

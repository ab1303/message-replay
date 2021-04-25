import { Actions } from 'src/types';
import { SelectedSubscriptionState, SubscriptionListEvent } from './types';

export const subscriptionListReducer = (
  state: SelectedSubscriptionState | null,
  action: Actions,
): SelectedSubscriptionState | null => {
  switch (action.type) {
    case SubscriptionListEvent.SUBSCRIPTION_SELECTED:
      return {
        ...action.payload,
      };
    default:
      return state;
  }
};

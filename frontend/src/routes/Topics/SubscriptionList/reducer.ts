import { Actions } from 'src/types';
import { SubscriptionDeadLettersEvent } from '../SubscriptionDeadLetters/types';
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
    case SubscriptionDeadLettersEvent.RESUBMIT_ALL_PROCESSED:
      return {
        ...action.payload.subscription,
      };
    default:
      return state;
  }
};

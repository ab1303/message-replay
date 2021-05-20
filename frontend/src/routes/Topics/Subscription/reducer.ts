import { Actions } from 'src/types';
import { SubscriptionDeadLettersEvent } from '../SubscriptionDeadLetters/types';
import { SubscriptionEvent, SubscriptionInfo } from './types';

export const subscriptionReducer = (
  state: SubscriptionInfo | null,
  action: Actions,
): SubscriptionInfo | null => {
  switch (action.type) {
    case SubscriptionDeadLettersEvent.RESUBMIT_ALL_PROCESSED:
      return {
        ...action.payload.subscription,
      };
    case SubscriptionEvent.INFO_REFRESH:
      return {
        ...action.payload.subscription,
      };
    default:
      return state;
  }
};

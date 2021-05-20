export type SubscriptionInfo = {
  name: string;
  activeMessageCount: number;
  deadLetterMessageCount: number;
  createdAt: string;
};

export type SubscriptionInfoQueryResponsePayload = {
  subscriptionInfo: SubscriptionInfo;
};

export type SubscriptionMessagesQueryResponse = {
  messageId: string;
  subject: string;
  sequenceNumber: number;
  enqueuedTime: Date;
  expiresAt: Date;
};

export type SubscriptionMessagesQueryResponsePayload = {
  messages: SubscriptionMessagesQueryResponse[];
};

export enum SubscriptionEvent {
  INFO_REFRESH = 'Subscription/REFRESH',
}

export type SubscriptionMessages = {
  [SubscriptionEvent.INFO_REFRESH]: {
    subscription: SubscriptionInfo;
  };
};

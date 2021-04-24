using Azure.Messaging.ServiceBus.Administration;
using System;
using System.Collections.Generic;

namespace MessageReplay.Api.Features.Topics.Responses
{

    public class GetTopicSubscription
    {
        public string Name { get; set; }
        public long ActiveMessageCount { get; set; }
        public long DeadLetterMessageCount { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class GetTopicSubscriptionsResponse
    {
        public List<GetTopicSubscription> Subscriptions { get; set; }
    }
}

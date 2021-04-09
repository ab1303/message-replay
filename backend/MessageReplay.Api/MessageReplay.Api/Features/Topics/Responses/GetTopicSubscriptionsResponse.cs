using Azure.Messaging.ServiceBus.Administration;
using System.Collections.Generic;

namespace MessageReplay.Api.Features.Topics.Responses
{
    public class GetTopicSubscription
    {
        public string Name { get; set; }
        public EntityStatus Status { get; set; }
        public int MaxDeliveryCount { get; set; }
    }

    public class GetTopicSubscriptionsResponse
    {
        public List<GetTopicSubscription> Subscriptions { get; set; }
    }
}

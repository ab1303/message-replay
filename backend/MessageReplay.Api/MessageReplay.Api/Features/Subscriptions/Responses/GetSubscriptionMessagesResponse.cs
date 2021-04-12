using Azure.Messaging.ServiceBus.Administration;
using System.Collections.Generic;

namespace MessageReplay.Api.Features.Topics.Responses
{
    public class GetSubscriptionMessage
    {
        public string Name { get; set; }
        public EntityStatus Status { get; set; }
        public int MaxDeliveryCount { get; set; }
    }

    public class GetSubscriptionMessagesResponse
    {
        public List<GetSubscriptionMessage> Messages { get; set; }
    }
}

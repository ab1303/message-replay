using Azure.Messaging.ServiceBus.Administration;
using System;
using System.Collections.Generic;

namespace MessageReplay.Api.Features.Topics.Responses
{
    public class GetSubscriptionMessage
    {
        public string MessageId { get; set; }
        public string Subject { get; set; }
        public long SequenceNumber { get; set; }
        public DateTimeOffset EnqueuedTime { get; set; }
        public DateTimeOffset ExpiresAt { get; set; }
    }

    public class GetSubscriptionMessagesResponse
    {
        public List<GetSubscriptionMessage> Messages { get; set; }
    }
}

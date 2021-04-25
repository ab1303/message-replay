using System;

namespace MessageReplay.Api.Features.Subscriptions.Responses
{
    public abstract class MessageResponse
    {
        public string MessageId { get; set; }
        public string Content { get; set; }
        public long SequenceNumber { get; set; }
        public long Size { get; set; }
        public int DeliveryCount { get; set; }
        public string DeadLetterReason { get; set; }
        public bool IsDlq { get; }
    }
}

using MessageReplay.Api.Features.Subscriptions.Responses;
using System.Collections.Generic;

namespace MessageReplay.Api.Features.Topics.Responses
{
    public class GetSubscriptionDeadLetter : MessageResponse
    {
        public string DeadLetterReason { get; set; }
    }

    public class GetSubscriptionDeadLettersResponse
    {
        public List<GetSubscriptionDeadLetter> DeadLetters { get; set; }
    }
}

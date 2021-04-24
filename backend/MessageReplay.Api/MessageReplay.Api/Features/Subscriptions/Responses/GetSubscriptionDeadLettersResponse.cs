using MessageReplay.Api.Features.Subscriptions.Responses;
using System.Collections.Generic;

namespace MessageReplay.Api.Features.Topics.Responses
{
    public class GetSubscriptionDeadLetter : MessageResponse
    {     
    }

    public class GetSubscriptionDeadLettersResponse
    {
        public List<GetSubscriptionDeadLetter> DeadLetters { get; set; }
    }
}

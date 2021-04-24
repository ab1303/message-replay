using MessageReplay.Api.Features.Subscriptions.Responses;
using System.Collections.Generic;

namespace MessageReplay.Api.Features.Topics.Responses
{
    public class GetSubscriptionMessage: MessageResponse
    {
       
    }

    public class GetSubscriptionMessagesResponse
    {
        public List<GetSubscriptionMessage> Messages { get; set; }
    }
}

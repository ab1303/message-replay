using System.Collections.Generic;
using System.Threading.Tasks;
using MessageReplay.Api.Common;
using MessageReplay.Api.Features.Topics.Responses;

namespace MessageReplay.Api.Helpers
{
    public class TopicInfoHelper
    {
        public static async Task<GetTopicSubscriptionResponse> GetSubscriptionInfo(string topicName,string subscriptionName)
        {
            var subscription = await ServiceBusManagementClientSingleton
                .Instance
                .Client
                .GetSubscriptionRuntimeInfoAsync(topicName,subscriptionName);

            return new GetTopicSubscriptionResponse
            {
                Name = subscription.SubscriptionName,
                ActiveMessageCount = subscription.MessageCountDetails.ActiveMessageCount,
                DeadLetterMessageCount = subscription.MessageCountDetails.DeadLetterMessageCount,
                CreatedAt = subscription.CreatedAt
            };
        }
    }
}
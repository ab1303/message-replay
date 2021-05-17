using MessageReplay.Api.Common;
using MessageReplay.Api.Features.Topics.Responses;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.ServiceBus.Management;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MessageReplay.Api.Features.Topics
{

    [ApiController]
    [Produces("application/json")]
    [Route("api/servicebus/[controller]")]

    public class TopicsController : ControllerBase
    {
        private readonly ILogger<TopicsController> _logger;
        private readonly ManagementClient _client;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="logger"></param>
        public TopicsController(ILogger<TopicsController> logger)
        {
            _logger = logger;
            _client = ServiceBusManagementClientSingleton.Instance.Client;
        }


        [HttpGet("{topicName}", Name = "GetTopicSubscriptions")]

        public async Task<IActionResult> GetTopicSubscriptions(string topicName)
        {
            var subscriptionsList = new List<GetTopicSubscriptionResponse>();
            var subscriptions = await _client.GetSubscriptionsRuntimeInfoAsync(topicName);

            foreach (var subscriptionInfo in subscriptions)
            {
                subscriptionsList.Add(new GetTopicSubscriptionResponse { 
                    Name = subscriptionInfo.SubscriptionName,
                    ActiveMessageCount = subscriptionInfo.MessageCountDetails.ActiveMessageCount,
                    DeadLetterMessageCount = subscriptionInfo.MessageCountDetails.DeadLetterMessageCount,
                    CreatedAt = subscriptionInfo.CreatedAt
                });
            }

            return Ok(new GetTopicSubscriptionsResponse
            {
                Subscriptions = subscriptionsList
            });
        }
    }
}

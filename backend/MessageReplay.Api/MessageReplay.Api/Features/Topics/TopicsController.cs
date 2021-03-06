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
            var subscriptionsList = new List<GetTopicSubscription>();
            var subscriptions = await _client.GetSubscriptionsRuntimeInfoAsync(topicName);

            foreach (var subscriptionProp in subscriptions)
            {
                subscriptionsList.Add(new GetTopicSubscription { 
                    Name = subscriptionProp.SubscriptionName,
                    ActiveMessageCount = subscriptionProp.MessageCountDetails.ActiveMessageCount,
                    DeadLetterMessageCount = subscriptionProp.MessageCountDetails.DeadLetterMessageCount,
                    CreatedAt = subscriptionProp.CreatedAt
                });
            }

            return Ok(new GetTopicSubscriptionsResponse
            {
                Subscriptions = subscriptionsList
            });
        }

    }
}

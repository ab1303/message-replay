using Azure.Messaging.ServiceBus.Administration;
using MessageReplay.Api.Common;
using MessageReplay.Api.Features.Topics.Responses;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MessageReplay.Api.Features.Settings
{

    [ApiController]
    [Produces("application/json")]
    [Route("api/servicebus/[controller]")]

    public class TopicsController : ControllerBase
    {
        private readonly ILogger<TopicsController> _logger;
        private readonly ServiceBusAdministrationClient _client;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="logger"></param>
        public TopicsController(ILogger<TopicsController> logger)
        {
            _logger = logger;
            _client = ServiceBusAdministrationClientSingleton.Instance.Client;
        }


        [HttpGet("{topicName}", Name = "GetTopicSubscriptions")]

        public async Task<IActionResult> GetTopicSubscriptions(string topicName)
        {
            var subscriptionsList = new List<GetTopicSubscription>();
            var subscriptions = _client.GetSubscriptionsAsync(topicName);

            await foreach (var subscriptionProp in subscriptions)
            {
                subscriptionsList.Add(new GetTopicSubscription { 
                    Name = subscriptionProp.SubscriptionName,
                    MaxDeliveryCount = subscriptionProp.MaxDeliveryCount,
                    Status = subscriptionProp.Status
                });
            }

            return Ok(new GetTopicSubscriptionsResponse
            {
                Subscriptions = subscriptionsList
            });
        }

    }
}

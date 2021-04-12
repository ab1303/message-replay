using Azure.Messaging.ServiceBus;
using Azure.Messaging.ServiceBus.Administration;
using MessageReplay.Api.Common;
using MessageReplay.Api.Common.Infrastructure;
using MessageReplay.Api.Features.Subscriptions.Queries;
using MessageReplay.Api.Features.Topics.Responses;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MessageReplay.Api.Features.Subscriptions
{

    [ApiController]
    [Produces("application/json")]
    [Route("api/servicebus/topics/{topicName}/[controller]")]

    public class SubscriptionsController : ControllerBase
    {
        private readonly ILogger<SubscriptionsController> _logger;
        private readonly IQueryHandlerAsync<GetSubscriptionMessagesQuery, (IEnumerable<GetSubscriptionMessageDto>, int)> _subscriptionMessagesQueryHandler;
        private readonly ServiceBusClient _client;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="subscriptionMessagesQueryHandler"></param>
        public SubscriptionsController(ILogger<SubscriptionsController> logger,
            IQueryHandlerAsync<GetSubscriptionMessagesQuery, (IEnumerable<GetSubscriptionMessageDto>, int)> subscriptionMessagesQueryHandler)
        {
            _logger = logger;
            _subscriptionMessagesQueryHandler = subscriptionMessagesQueryHandler;
            _client = ServiceBusClientSingleton.Instance.Client;
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="topicName"></param>
        /// <param name="subscriptionName"></param>
        /// <returns></returns>
        [HttpGet("{subscriptionName}/messages", Name = "GetSubscriptionMessages")]

        public async Task<IActionResult> GetSubscriptionMessages(string topicName, string subscriptionName)
        {
            var messagesList = new List<GetSubscriptionMessage>();

            var query = new GetSubscriptionMessagesQuery(topicName, subscriptionName);

            var queryResult = await _subscriptionMessagesQueryHandler.GetResultAsync(query);

            return Ok(new GetSubscriptionMessagesResponse
            {
                Messages = messagesList
            });
        }

        [HttpGet("{subscriptionName}/deadletters", Name = "GetSubscriptionDeadLetters")]

        public async Task<IActionResult> GetSubscriptionDeadLetters(string topicName, string subscriptionName)
        {
            var deadLettersList = new List<GetSubscriptionDeadLetter>();
            //var subscriptions = _client.GetSubscriptionsAsync(subscriptionName);

            //await foreach (var subscriptionProp in subscriptions)
            //{
            //    deadLettersList.Add(new GetSubscriptionDeadLetter
            //    {
            //        Name = subscriptionProp.SubscriptionName,
            //        MaxDeliveryCount = subscriptionProp.MaxDeliveryCount,
            //        Status = subscriptionProp.Status
            //    });
            //}

            return Ok(new GetSubscriptionDeadLettersResponse
            {
                DeadLetters = deadLettersList
            });
        }

    }
}

using AutoMapper;
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
        private readonly IMapper _mapper;
        private readonly IQueryHandlerAsync<GetSubscriptionMessagesQuery, IEnumerable<GetSubscriptionMessageDto>> _subscriptionMessagesQueryHandler;
        private readonly IQueryHandlerAsync<GetSubscriptionDeadLettersQuery, IEnumerable<GetSubscriptionDeadLetterDto>> _subscriptionDeadLettersQueryHandler;
        private readonly ServiceBusClient _client;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="mapper"></param>
        /// <param name="subscriptionMessagesQueryHandler"></param>
        /// <param name="subscriptionDeadLettersQueryHandler"></param>
        public SubscriptionsController(ILogger<SubscriptionsController> logger,
            IMapper mapper,
            IQueryHandlerAsync<GetSubscriptionMessagesQuery, IEnumerable<GetSubscriptionMessageDto>> subscriptionMessagesQueryHandler,
            IQueryHandlerAsync<GetSubscriptionDeadLettersQuery, IEnumerable<GetSubscriptionDeadLetterDto>> subscriptionDeadLettersQueryHandler
            )
        {
            _logger = logger;
            _mapper = mapper;
            _subscriptionMessagesQueryHandler = subscriptionMessagesQueryHandler;
            _subscriptionDeadLettersQueryHandler = subscriptionDeadLettersQueryHandler;
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
            var query = new GetSubscriptionMessagesQuery(topicName, subscriptionName);
            var messages = await _subscriptionMessagesQueryHandler.GetResultAsync(query);

            return Ok(new GetSubscriptionMessagesResponse
            {
                Messages = _mapper.Map<List<GetSubscriptionMessage>>(messages),
            });
        }

        [HttpGet("{subscriptionName}/deadletters", Name = "GetSubscriptionDeadLetters")]

        public async Task<IActionResult> GetSubscriptionDeadLetters(string topicName, string subscriptionName)
        {
            var query = new GetSubscriptionDeadLettersQuery(topicName, subscriptionName);
            var deadLetters = await _subscriptionDeadLettersQueryHandler.GetResultAsync(query);

            return Ok(new GetSubscriptionDeadLettersResponse
            {
                DeadLetters = _mapper.Map<List<GetSubscriptionDeadLetter>>(deadLetters)
            });
        }

    }
}

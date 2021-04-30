using AutoMapper;
using MessageReplay.Api.Common;
using MessageReplay.Api.Features.Topics.Responses;
using MessageReplay.Api.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MessageReplay.Api.Features.Subscriptions
{

    [ApiController]
    [Produces("application/json")]
    [Route("api/servicebus/topics/{topicName}/[controller]")]

    public class SubscriptionsController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly ILogger<SubscriptionsController> _logger;
        private readonly ITopicHelper _topicHelper;
        private readonly string _connectionString;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="mapper"></param>
        /// <param name="topicHelper"></param>
        public SubscriptionsController(IMapper mapper, ILogger<SubscriptionsController> logger, ITopicHelper topicHelper)

        {
            _logger = logger;
            _mapper = mapper;
            _topicHelper = topicHelper;
            _connectionString = ServiceBusClientSingleton.Instance.ConnectionString;

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
            var messages = await _topicHelper.GetMessagesBySubscriptionAsync(_connectionString, topicName, subscriptionName);

            return Ok(new GetSubscriptionMessagesResponse
            {
                Messages = _mapper.Map<List<GetSubscriptionMessage>>(messages),
            });
        }

        [HttpGet("{subscriptionName}/deadletters", Name = "GetSubscriptionDeadLetters")]

        public async Task<IActionResult> GetSubscriptionDeadLetters(string topicName, string subscriptionName)
        {
            var deadLetters = await _topicHelper.GetDlqMessagesAsync(_connectionString, topicName, subscriptionName);

            return Ok(new GetSubscriptionDeadLettersResponse
            {
                DeadLetters = _mapper.Map<List<GetSubscriptionDeadLetter>>(deadLetters)
            });
        }

        [HttpPost("{subscriptionName}/deadletters/purgeselected", Name = "PurgeSelectedSubscriptionDeadLetters")]

        public async Task<IActionResult> PurgeSelectedSubscriptionDeadLetters(string topicName, string subscriptionName, [FromBody] string [] messageIds)
        {
            try
            {
                var result = await _topicHelper.PurgeDlqMessagesBySequenceNumbers(_connectionString, topicName, subscriptionName, messageIds);
                if (result)
                    return NoContent();
                else return BadRequest();
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpDelete("{subscriptionName}/deadletters", Name = "PurgeAllSubscriptionDeadLetters")]

        public async Task<IActionResult> PurgeAllSubscriptionDeadLetters(string topicName, string subscriptionName, [FromBody] long[] sequenceNo)
        {
            try
            {
                await _topicHelper.PurgeMessagesAsync(_connectionString, topicName, subscriptionName, true);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

    }
}

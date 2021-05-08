﻿using System;
using AutoMapper;
using MessageReplay.Api.Common;
using MessageReplay.Api.Features.Topics.Responses;
using MessageReplay.Api.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MessageReplay.Api.Features.Subscriptions.Requests;
using MessageReplay.Api.Features.Subscriptions.Responses;
using System.Net;

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
        private readonly ReplayMessageService _replayMessageService;
        private readonly string _connectionString;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="mapper"></param>
        /// <param name="topicHelper"></param>
        public SubscriptionsController(
            IMapper mapper,
            ILogger<SubscriptionsController> logger,
            ITopicHelper topicHelper,
            ReplayMessageService replayMessageService)

        {
            _logger = logger;
            _mapper = mapper;
            _topicHelper = topicHelper;
            _replayMessageService = replayMessageService;
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
            var messages =
                await _topicHelper.GetMessagesBySubscriptionAsync(_connectionString, topicName, subscriptionName);

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

        [HttpPost("{subscriptionName}/deadletters/resubmitAll", Name = "ResubmitAll")]
        public async Task<IActionResult> ReplayAllMessages(string topicName, string subscriptionName)
        {
            var result = await _replayMessageService.StartReplayingMessages(_connectionString, topicName, subscriptionName);
            return Accepted(result);
        }

        [HttpPost("{subscriptionName}/deadletters/resubmit", Name = "ResubmitSelected")]

        public async Task<IActionResult> ReplaySelectedDeadLetters(
            string topicName,
            string subscriptionName,
            [FromBody] ReplaySelectedDeadLettersRequest request)
        {

            var result = await _topicHelper.DeleteSelectedDlqMessages(
                _connectionString,
                topicName,
                subscriptionName,
                request.MessageIds);

            if (result.IsSuccess)
                return Ok(_mapper.Map<ReplaySelectedDlqMessagesResponse>(result.Model));

            return StatusCode((int)HttpStatusCode.InternalServerError, result.Error);
        }


        [HttpGet("{subscriptionName}/deadletters/resubmit/status/{processId}", Name = "ResubmitStatus")]
        public async Task<IActionResult> GetStatus(string topicName, string subscriptionName, Guid processId)
        {
            var result = await _replayMessageService.GetStatus(topicName, subscriptionName);
            return Ok(result);
        }

        [HttpPost("{subscriptionName}/deadletters/delete", Name = "DeleteSelected")]

        public async Task<IActionResult> DeleteSelectedDeadLetters(
            string topicName,
            string subscriptionName,
            [FromBody] DeleteSelectedDeadLettersRequest request)
        {

            var result = await _topicHelper.DeleteSelectedDlqMessages(
                _connectionString,
                topicName,
                subscriptionName,
                request.MessageIds);

            if (result.IsSuccess)
                return Ok(_mapper.Map<DeleteSelectedDlqMessagesResponse>(result.Model));

            return StatusCode((int)HttpStatusCode.InternalServerError, result.Error);
        }

        [HttpPost("{subscriptionName}/deadletters/deleteAll", Name = "DeleteAll")]

        public async Task<IActionResult> DeleteAllSubscriptionDeadLetters(string topicName, string subscriptionName, [FromBody] long[] sequenceNo)
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

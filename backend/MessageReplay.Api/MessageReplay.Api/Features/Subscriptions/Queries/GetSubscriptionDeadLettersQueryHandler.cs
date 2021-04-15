using Azure.Messaging.ServiceBus;
using MessageReplay.Api.Common;
using MessageReplay.Api.Common.Infrastructure;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MessageReplay.Api.Features.Subscriptions.Queries
{

    public class GetSubscriptionDeadLettersQuery
    {
        public Query BaseQuery { get; }
        public string TopicName { get; }
        public string SubscriptionName { get; }

        public GetSubscriptionDeadLettersQuery(string topicName, string subscriptionName, (int pageNumber, int size)? pagination = null)
        {
            BaseQuery = pagination == null
                ? new QueryBuilder()
                    .WithPagination(QueryDefaults.DefaultPageNumber, QueryDefaults.DefaultPageSize)
                    .BuildQuery()
                : new QueryBuilder().WithPagination(pagination.Value.pageNumber, pagination.Value.size)
                    .BuildQuery()
                ;
            TopicName = topicName;
            SubscriptionName = subscriptionName;
        }
    }

    public class GetSubscriptionDeadLetterDto
    {
        public string MessageId { get; set; }
        public string Subject { get; set; }
        public long SequenceNumber { get; set; }
        public DateTimeOffset EnqueuedTime { get; set; }
        public DateTimeOffset ExpiresAt { get; set; }
    }


    public class GetSubscriptionDeadLettersQueryHandler : IQueryHandlerAsync<GetSubscriptionDeadLettersQuery, IEnumerable<GetSubscriptionDeadLetterDto>>
    {
        private ServiceBusClient _serviceBusClient;
        public GetSubscriptionDeadLettersQueryHandler()
        {
            _serviceBusClient = ServiceBusClientSingleton.Instance.Client;
        }

        public async Task<IEnumerable<GetSubscriptionDeadLetterDto>> GetResultAsync(GetSubscriptionDeadLettersQuery query)
        {

            var deadLetters = new List<GetSubscriptionDeadLetterDto>();

            var receiver = _serviceBusClient.CreateReceiver(query.TopicName, query.SubscriptionName,
                new ServiceBusReceiverOptions
                {
                    SubQueue = SubQueue.DeadLetter,
                    ReceiveMode = ServiceBusReceiveMode.PeekLock,
                });

            var messages = await receiver.ReceiveMessagesAsync(QueryDefaults.MaxPageSize, QueryDefaults.MaxWaitTime);


            foreach (var message in messages)
            {
                deadLetters.Add(new GetSubscriptionDeadLetterDto
                {
                    MessageId = message.MessageId,
                    Subject = message.Subject,
                    SequenceNumber = message.SequenceNumber,
                    EnqueuedTime = message.EnqueuedTime,
                    ExpiresAt = message.ExpiresAt,
                });
            }

            return deadLetters;
        }
    }
}

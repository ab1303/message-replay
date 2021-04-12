using Azure.Messaging.ServiceBus;
using MessageReplay.Api.Common;
using MessageReplay.Api.Common.Infrastructure;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MessageReplay.Api.Features.Subscriptions.Queries
{

    public class GetSubscriptionMessagesQuery
    {
        public Query BaseQuery { get; }
        public string TopicName { get; }
        public string SubscriptionName { get; }

        public GetSubscriptionMessagesQuery(string topicName, string subscriptionName, (int pageNumber, int size)? pagination = null)
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

    public class GetSubscriptionMessageDto
    {
        public string MessageId { get; set; }
        public string Subject { get; set; }
        public long SequenceNumber { get; set; }
        public DateTimeOffset EnqueuedTime { get; set; }
        public DateTimeOffset ExpiresAt { get; set; }
    }


    public class GetSubscriptionMessagesQueryHandler : IQueryHandlerAsync<GetSubscriptionMessagesQuery, (IEnumerable<GetSubscriptionMessageDto>, int)>
    {
        private ServiceBusClient _serviceBusClient;
        public GetSubscriptionMessagesQueryHandler()
        {
            _serviceBusClient = ServiceBusClientSingleton.Instance.Client;
        }

        public async Task<(IEnumerable<GetSubscriptionMessageDto>, int)> GetResultAsync(GetSubscriptionMessagesQuery query)
        {

            var messagesList = new List<GetSubscriptionMessageDto>();

            var receiver = _serviceBusClient.CreateReceiver(query.TopicName, query.SubscriptionName);

            await foreach (var message in receiver.ReceiveMessagesAsync())
            {
                messagesList.Add(new GetSubscriptionMessageDto
                {
                    MessageId = message.MessageId,
                    Subject = message.Subject,
                    SequenceNumber = message.SequenceNumber,                    
                    EnqueuedTime = message.EnqueuedTime,
                    ExpiresAt = message.ExpiresAt,
                });
            }

            throw new System.NotImplementedException();
        }
    }
}

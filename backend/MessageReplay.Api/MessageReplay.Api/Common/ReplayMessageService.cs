using System;
using System.Threading.Tasks;
using MessageReplay.Api.Features.Topics.Responses;
using MessageReplay.Api.Helpers;

namespace MessageReplay.Api.Common
{
    public record ReplayMessagesLongRunningProcess
    {
        public Guid ProcessId { get; set; }
        public TimeSpan CallBackAfter => new TimeSpan(0, 0, 3);
        public bool InProgress { get; set; }
        public GetTopicSubscription Subscription { get; set; }

        public string CallBackUrl =>
            "/api/servicebus/topics/replay-poc-topic/Subscriptions/replay-poc-subscription/deadletters/resubmit/status/94863f3e-11c0-4026-9fd8-96b3a0c607b7";
    }

    public class ReplayMessageService
    {
        private readonly TopicProcessor _topicProcessor;

        public ReplayMessageService(TopicProcessor topicProcessor)
        {
            _topicProcessor = topicProcessor;
        }

        public async Task<ReplayMessagesLongRunningProcess> StartReplayingMessages(string connectionString,
            string topicName, string subscriptionName)
        {
            // _topicProcessor.StartResubmitting(connectionString, topicName, subscriptionName);
            return await _topicProcessor.GetStatus(topicName,subscriptionName);
        }

        public async Task<ReplayMessagesLongRunningProcess> GetStatus(string topicName, string subscriptionName)
        {
            return await _topicProcessor.GetStatus(topicName,subscriptionName);
        }
    }
}
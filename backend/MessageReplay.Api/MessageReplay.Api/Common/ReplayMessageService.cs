using System;
using System.Threading.Tasks;
using MessageReplay.Api.Features.Topics.Responses;
using MessageReplay.Api.Helpers;

namespace MessageReplay.Api.Common
{
    public record LongRunningProcessResponse
    {
        public Guid ProcessId { get; set; }
        public TimeSpan CallBackAfter => new TimeSpan(0, 0, 3);
        public bool InProgress { get; set; }
        public GetTopicSubscriptionResponse Subscription { get; set; }

        public bool HasErrors { get; set; }
        public string ErrorTitle { get; set; }
        public string ErrorStackTrace { get; set; }
        
        public string CallBackUrl =>
            $"servicebus/topics/replay-poc-topic/Subscriptions/replay-poc-subscription/deadletters/resubmit/status/{ProcessId}";
    }

    public class ReplayMessageService
    {
        private readonly TopicProcessor _topicProcessor;

        public ReplayMessageService(TopicProcessor topicProcessor)
        {
            _topicProcessor = topicProcessor;
        }

        public async Task<LongRunningProcessResponse> StartReplayingMessages(string connectionString,
            string topicName, string subscriptionName)
        {
            _topicProcessor.StartLongRunningProcess(connectionString, topicName, subscriptionName);
            return await _topicProcessor.GetStatus(topicName, subscriptionName);
        }

        public async Task<LongRunningProcessResponse> GetStatus(string topicName, string subscriptionName)
        {
            return await _topicProcessor.GetStatus(topicName, subscriptionName);
        }
    }
}
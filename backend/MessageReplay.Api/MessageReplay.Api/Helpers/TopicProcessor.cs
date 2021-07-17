using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MessageReplay.Api.Common;
using Microsoft.Azure.ServiceBus;
using Microsoft.Azure.ServiceBus.Core;
using AzureMessage = Microsoft.Azure.ServiceBus.Message;

namespace MessageReplay.Api.Helpers
{
    public class TopicProcessor : ILongRunningProcess ,IDisposable
    {
        private int _maxMessageCount = 100;
        private MessageReceiver _receiver;
        private TopicClient _topicClient;
        readonly LongRunningProcessResponse _longRunningProcessResponse;

        public TopicProcessor()
        {
            _longRunningProcessResponse = new LongRunningProcessResponse();

        }

        private void CreateClients(string connectionString, string topicName, string subscriptionName)
        {
            var path = EntityNameHelper.FormatSubscriptionPath(topicName, subscriptionName);
            var deadLetterPath = EntityNameHelper.FormatDeadLetterPath(path);
            _receiver = new MessageReceiver(connectionString, deadLetterPath, ReceiveMode.PeekLock);
            _topicClient = new TopicClient(connectionString, topicName);
        }

        private async Task<IEnumerable<AzureMessage>> ConsumeMessagesFromDlq()
        {
            var receivedMessages = await _receiver.ReceiveAsync(_maxMessageCount, TimeSpan.FromMilliseconds(500));
            return receivedMessages.AsEnumerable();
        }

        private async Task PublishMessagesToTopic(IEnumerable<AzureMessage> messages)
        {
            await _topicClient.SendAsync(messages.Select(m => m.CloneMessage()).ToList());
        }

        public void Dispose()
        {
            _receiver?.CloseAsync();
            _topicClient?.CloseAsync();
        }


        private async Task CompleteMessage(List<AzureMessage> message)
        {
            await _receiver.CompleteAsync(message.Select(m => m.SystemProperties.LockToken));
        }

        public async Task<LongRunningProcessResponse> GetStatus(string topicName, string subscriptionName)
        {
            _longRunningProcessResponse.Subscription =
                await TopicInfoHelper.GetSubscriptionInfo(topicName, subscriptionName);
            return _longRunningProcessResponse;
        }

        public void StartLongRunningProcess(string connectionString, string topicName, string subscriptionName)
        {
            if (_longRunningProcessResponse.InProgress)
            {
                return;
            }

            _longRunningProcessResponse.InProgress = true;
            _longRunningProcessResponse.ProcessId = Guid.NewGuid();


            CreateClients(connectionString, topicName, subscriptionName);
            Task.Factory.StartNew(async () =>
            {
                while (true)
                {
                    try
                    {
                        _longRunningProcessResponse.Subscription =
                            await TopicInfoHelper.GetSubscriptionInfo(topicName, subscriptionName);
                        var consumedMessagesFromDlq = await ConsumeMessagesFromDlq();
                        if (consumedMessagesFromDlq == null)
                        {
                            _longRunningProcessResponse.InProgress = false;
                            break;
                        }

                        var messages = consumedMessagesFromDlq.ToList();
                        await PublishMessagesToTopic(messages);
                        await CompleteMessage(messages);
                    }
                    catch (Exception exception)
                    {
                        _longRunningProcessResponse.HasErrors = true;
                        _longRunningProcessResponse.ErrorTitle = exception.Message;
                        _longRunningProcessResponse.ErrorStackTrace = exception.ToString();
                    }
                }
            });
        }
    }
}
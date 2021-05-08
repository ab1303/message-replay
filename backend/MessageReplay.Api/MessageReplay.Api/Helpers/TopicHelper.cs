using System;
using Microsoft.Azure.ServiceBus;
using Microsoft.Azure.ServiceBus.Core;
using Microsoft.Azure.ServiceBus.Management;
using MessageReplay.Api.Models;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Message = MessageReplay.Api.Models.Message;
using AzureMessage = Microsoft.Azure.ServiceBus.Message;
using MessageReplay.Api.Dto;
using MessageReplay.Api.Common;

namespace MessageReplay.Api.Helpers
{
    public class TopicHelper : ITopicHelper
    {
        private int _maxMessageCount = 100;

        public async Task<IList<string>> GetTopicsAsync(string connectionString)
        {
            var client = new ManagementClient(connectionString);
            var busTopics = await client.GetTopicsAsync();
            await client.CloseAsync();

            var topics = busTopics.Select(t => t.Path).ToList();

            return topics;
        }

        public async Task<SubscriptionRuntimeInfo> GetSubscriptionRuntimeInfoAsync(string connectionString,
            string topicPath, string subscriptionName)
        {
            ManagementClient client = new ManagementClient(connectionString);
            var runtimeInfo = await client.GetSubscriptionRuntimeInfoAsync(topicPath, subscriptionName);
            await client.CloseAsync();

            return runtimeInfo;
        }

        public async Task<IList<ServiceBusSubscription>> GetSubscriptionsAsync(string connectionString, string topicPath)
        {
            IList<ServiceBusSubscription> subscriptions = new List<ServiceBusSubscription>();
            var client = new ManagementClient(connectionString);
            var topicSubscription = await client.GetSubscriptionsRuntimeInfoAsync(topicPath);
            await client.CloseAsync();

            foreach (var sub in topicSubscription)
            {
                subscriptions.Add(new ServiceBusSubscription(sub));
            }

            return subscriptions;
        }

        public async Task<IList<Message>> GetMessagesBySubscriptionAsync(string connectionString, string topicName,
            string subscriptionName)
        {
            var path = EntityNameHelper.FormatSubscriptionPath(topicName, subscriptionName);

            var messageReceiver = new MessageReceiver(connectionString, path, ReceiveMode.PeekLock);
            var subscriptionMessages = await messageReceiver.PeekAsync(_maxMessageCount);
            await messageReceiver.CloseAsync();

            var result = subscriptionMessages.Select(message => new Message(message, false)).ToList();
            return result;
        }

        public async Task<IList<Message>> GetDlqMessagesAsync(string connectionString, string topic, string subscription)
        {
            var path = EntityNameHelper.FormatSubscriptionPath(topic, subscription);
            var deadletterPath = EntityNameHelper.FormatDeadLetterPath(path);

            var receiver = new MessageReceiver(connectionString, deadletterPath, ReceiveMode.PeekLock);
            var receivedMessages = await receiver.PeekAsync(_maxMessageCount);
            await receiver.CloseAsync();

            var result = receivedMessages.Select(message => new Message(message, true)).ToList();
            return result;
        }

        public async Task<NamespaceInfo> GetNamespaceInfoAsync(string connectionString)
        {
            var client = new ManagementClient(connectionString);
            return await client.GetNamespaceInfoAsync();
        }

        /// <summary>
        /// Use this to publish a message to the topic
        /// </summary>
        /// <param name="connectionString"></param>
        /// <param name="topicPath"></param>
        /// <param name="content"></param>
        public async Task SendMessageAsync(string connectionString, string topicPath, string content)
        {
            var message = new AzureMessage { Body = Encoding.UTF8.GetBytes(content) };
            await SendMessageAsync(connectionString, topicPath, message);
        }

        public async Task SendMessageAsync(string connectionString, string topicPath, AzureMessage message)
        {
            var topicClient = new TopicClient(connectionString, topicPath);
            await topicClient.SendAsync(message);
            await topicClient.CloseAsync();
        }

        public async Task DeleteMessageAsyncFromDlq(
            string connectionString,
            string topicPath,
            string subscriptionPath,
            IEnumerable<AzureMessage> messages)
        {
            var path = EntityNameHelper.FormatSubscriptionPath(topicPath, subscriptionPath);
            var dlqPath = EntityNameHelper.FormatDeadLetterPath(path);
            var receiver = new MessageReceiver(connectionString, dlqPath, ReceiveMode.PeekLock);
            foreach (var message in messages)
            {
                await receiver.CompleteAsync(message.SystemProperties.LockToken);
            }
            await receiver.CloseAsync();
        }

        public async Task DeleteMessageAsync(string connectionString, string topicPath, string subscriptionPath,
            Message message, bool isDlq)
        {
            var path = EntityNameHelper.FormatSubscriptionPath(topicPath, subscriptionPath);
            path = isDlq ? EntityNameHelper.FormatDeadLetterPath(path) : path;

            var receiver = new MessageReceiver(connectionString, path, ReceiveMode.PeekLock);

            while (true)
            {
                var messages = await receiver.ReceiveAsync(_maxMessageCount);
                if (messages == null || messages.Count == 0)
                {
                    break;
                }

                var foundMessage = messages.FirstOrDefault(m => m.MessageId.Equals(message.MessageId));
                if (foundMessage != null)
                {
                    await receiver.CompleteAsync(foundMessage.SystemProperties.LockToken);
                    break;
                }
            }

            await receiver.CloseAsync();
        }

        public async Task<long> PurgeMessagesAsync(string connectionString, string topicPath, string subscriptionPath,
            bool isDlq)
        {
            var path = EntityNameHelper.FormatSubscriptionPath(topicPath, subscriptionPath);
            path = isDlq ? EntityNameHelper.FormatDeadLetterPath(path) : path;

            long purgedCount = 0;
            var receiver = new MessageReceiver(connectionString, path, ReceiveMode.ReceiveAndDelete);
            var operationTimeout = TimeSpan.FromSeconds(5);
            while (true)
            {
                var messages = await receiver.ReceiveAsync(_maxMessageCount, operationTimeout);
                if (messages == null || messages.Count == 0)
                {
                    break;
                }

                purgedCount += messages.Count;
            }

            await receiver.CloseAsync();
            return purgedCount;
        }

        private async Task<AzureMessage> PeekDlqMessageBySequenceNumber(string connectionString, string topicPath,
            string subscriptionPath, long sequenceNumber)
        {
            var path = EntityNameHelper.FormatSubscriptionPath(topicPath, subscriptionPath);
            var deadletterPath = EntityNameHelper.FormatDeadLetterPath(path);

            var receiver = new MessageReceiver(connectionString, deadletterPath, ReceiveMode.PeekLock);
            var azureMessage = await receiver.PeekBySequenceNumberAsync(sequenceNumber);
            await receiver.CloseAsync();

            return azureMessage;
        }

        public async Task ResubmitDlqMessageAsync(string connectionString, string topicPath, string subscriptionPath,
            Message message)
        {
            var azureMessage = await PeekDlqMessageBySequenceNumber(connectionString, topicPath, subscriptionPath,
                message.SequenceNumber);
            var clonedMessage = azureMessage.CloneMessage();

            await SendMessageAsync(connectionString, topicPath, clonedMessage);

            await DeleteMessageAsync(connectionString, topicPath, subscriptionPath, message, true);
        }

        public async Task DeadletterMessageAsync(string connectionString, string topicPath, string subscriptionPath,
            Message message)
        {
            var path = EntityNameHelper.FormatSubscriptionPath(topicPath, subscriptionPath);

            var receiver = new MessageReceiver(connectionString, path, ReceiveMode.PeekLock);

            while (true)
            {
                var messages = await receiver.ReceiveAsync(_maxMessageCount);
                if (messages == null || messages.Count == 0)
                {
                    break;
                }

                var foundMessage = messages.FirstOrDefault(m => m.MessageId.Equals(message.MessageId));
                if (foundMessage != null)
                {
                    await receiver.DeadLetterAsync(foundMessage.SystemProperties.LockToken);
                    break;
                }
            }

            await receiver.CloseAsync();
        }


        public async Task<Result<DeleteSelectedDlqMessagesDto>> DeleteSelectedDlqMessages(string connectionString, string topicPath,
            string subscriptionPath, string[] messageIds)
        {
            try
            {
                var path = EntityNameHelper.FormatSubscriptionPath(topicPath, subscriptionPath);
                var deadletterPath = EntityNameHelper.FormatDeadLetterPath(path);

                var receiver = new MessageReceiver(connectionString, deadletterPath, ReceiveMode.PeekLock);
                var messages = await receiver.ReceiveAsync(_maxMessageCount);
                if (messages == null || messages.Count == 0)
                {
                    return Result<DeleteSelectedDlqMessagesDto>.Fail(
                        new Error
                        {
                            Message = "Messages not received for settlement"
                        });
                }

                var lockedUntilUtc = messages.First().SystemProperties.LockedUntilUtc;
                var failedMessageIds = new List<string>();
                foreach (string msgId in messageIds)
                {
                    var azureMessage = messages.FirstOrDefault(m => m.MessageId.Equals(msgId));
                    if (azureMessage != null)
                    {
                        await receiver.CompleteAsync(azureMessage.SystemProperties.LockToken);
                        continue;
                    }

                    failedMessageIds.Add(msgId);

                }

                await receiver.CloseAsync();
                return Result<DeleteSelectedDlqMessagesDto>.Ok(
                        new DeleteSelectedDlqMessagesDto
                        {
                            LockedUntilUtc = lockedUntilUtc,
                            FailedMessageIds = failedMessageIds
                        });

            }
            catch (Exception ex)
            {
                return Result<DeleteSelectedDlqMessagesDto>.Fail(
                      new Error
                      {
                          Message = ex.Message
                      });
            }

        }

        public async Task<Result<ResubmitSelectedDlqMessagesDto>> ResubmitSelectedDlqMessages(string connectionString, string topicPath,
            string subscriptionPath, string[] messageIds)
        {
            try
            {
                var path = EntityNameHelper.FormatSubscriptionPath(topicPath, subscriptionPath);
                var deadletterPath = EntityNameHelper.FormatDeadLetterPath(path);

                var receiver = new MessageReceiver(connectionString, deadletterPath, ReceiveMode.PeekLock);
                var messages = await receiver.ReceiveAsync(_maxMessageCount);
                if (messages == null || messages.Count == 0)
                {
                    return Result<ResubmitSelectedDlqMessagesDto>.Fail(
                        new Error
                        {
                            Message = "Messages not received for settlement"
                        });
                }

                var lockedUntilUtc = messages.First().SystemProperties.LockedUntilUtc;
                var failedMessageIds = new List<string>();
                foreach (string msgId in messageIds)
                {
                    var azureMessage = messages.FirstOrDefault(m => m.MessageId.Equals(msgId));
                    if (azureMessage != null)
                    {
                        var clonedMessage = azureMessage.CloneMessage();

                        await SendMessageAsync(connectionString, topicPath, clonedMessage);

                        await receiver.CompleteAsync(azureMessage.SystemProperties.LockToken);
                        continue;
                    }

                    failedMessageIds.Add(msgId);

                }

                await receiver.CloseAsync();
                return Result<ResubmitSelectedDlqMessagesDto>.Ok(
                        new ResubmitSelectedDlqMessagesDto
                        {
                            LockedUntilUtc = lockedUntilUtc,
                            FailedMessageIds = failedMessageIds
                        });

            }
            catch (Exception ex)
            {
                return Result<ResubmitSelectedDlqMessagesDto>.Fail(
                      new Error
                      {
                          Message = ex.Message
                      });
            }

        }


    }

    public interface ITopicHelper
    {
        public Task<NamespaceInfo> GetNamespaceInfoAsync(string connectionString);
        public Task<IList<string>> GetTopicsAsync(string connectionString);
        public Task<IList<ServiceBusSubscription>> GetSubscriptionsAsync(string connectionString, string topicPath);
        public Task<IList<Message>> GetDlqMessagesAsync(string connectionString, string topic, string subscription);
        public Task<IList<Message>> GetMessagesBySubscriptionAsync(string connectionString, string topicName, string subscriptionName);
        public Task SendMessageAsync(string connectionString, string topicPath, string content);
        public Task SendMessageAsync(string connectionString, string topicPath, AzureMessage message);
        public Task DeleteMessageAsync(string connectionString, string topicPath, string subscriptionPath, Message message, bool isDlq);
        public Task<SubscriptionRuntimeInfo> GetSubscriptionRuntimeInfoAsync(string connectionString, string topicPath,
            string subscriptionName);
        public Task<long> PurgeMessagesAsync(string connectionString, string topicPath, string subscriptionPath, bool isDlq);
        public Task ResubmitDlqMessageAsync(string connectionString, string topicPath, string subscriptionPath,
            Message message);
        public Task DeadletterMessageAsync(string connectionString, string topicPath, string subscriptionPath,
            Message message);
        public Task<Result<DeleteSelectedDlqMessagesDto>> DeleteSelectedDlqMessages(string connectionString, string topicPath,
            string subscriptionPath, string[] messageIds);

        public Task<Result<ResubmitSelectedDlqMessagesDto>> ResubmitSelectedDlqMessages(string connectionString, string topicPath,
            string subscriptionPath, string[] messageIds);
    }
}
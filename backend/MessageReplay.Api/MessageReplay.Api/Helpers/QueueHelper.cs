using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Azure.ServiceBus;
using Microsoft.Azure.ServiceBus.Core;
using Microsoft.Azure.ServiceBus.Management;
using MessageReplay.Api.Models;
using Message = MessageReplay.Api.Models.Message;
using AzureMessage = Microsoft.Azure.ServiceBus.Message;

namespace MessageReplay.Api.Helpers
{
    public class QueueHelper : IQueueHelper
    {
        private int _maxMessageCount = 100;

        public async Task<IList<string>> GetQueuesAsync(string connectionString)
        {
            var client = new ManagementClient(connectionString);
            var queuesInfo = await client.GetQueuesRuntimeInfoAsync();
            await client.CloseAsync();
            var queues = queuesInfo.Select(queue => queue.Path).ToList();
            return queues;
        }

        public async Task SendMessageAsync(string connectionString, string queueName, string content)
        {
            var message = new AzureMessage {Body = Encoding.UTF8.GetBytes(content)};
            await SendMessageAsync(connectionString, queueName, message);
        }

        public async Task SendMessageAsync(string connectionString, string queueName, AzureMessage message)
        {
            var client = new QueueClient(connectionString, queueName);
            await client.SendAsync(message);
            await client.CloseAsync();
        }

        public async Task<IList<Message>> GetMessagesAsync(string connectionString, string queueName)
        {
            var receiver = new MessageReceiver(connectionString, queueName, ReceiveMode.PeekLock);
            var messages = await receiver.PeekAsync(_maxMessageCount);
            return messages.Select(msg => new Message(msg, false)).ToList();
        }

        public async Task<IList<Message>> GetDlqMessagesAsync(string connectionString, string queueName)
        {
            var deadletterPath = EntityNameHelper.FormatDeadLetterPath(queueName);

            var receiver = new MessageReceiver(connectionString, deadletterPath, ReceiveMode.PeekLock);
            var receivedMessages = await receiver.PeekAsync(_maxMessageCount);
            await receiver.CloseAsync();

            return receivedMessages.Select(message => new Message(message, true)).ToList();
        }
        
        public async Task DeadletterMessageAsync(string connectionString, string queue, Message message)
        {
            var receiver = new MessageReceiver(connectionString, queue, ReceiveMode.PeekLock);

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
        
        public async Task DeleteMessageAsync(string connectionString, string queue,
            Message message, bool isDlq)
        {
            var path = isDlq ? EntityNameHelper.FormatDeadLetterPath(queue) : queue;

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
        
        private async Task<AzureMessage> PeekDlqMessageBySequenceNumber(string connectionString, string queue, long sequenceNumber)
        {
            var deadletterPath = EntityNameHelper.FormatDeadLetterPath(queue);

            var receiver = new MessageReceiver(connectionString, deadletterPath, ReceiveMode.PeekLock);
            var azureMessage = await receiver.PeekBySequenceNumberAsync(sequenceNumber);
            await receiver.CloseAsync();
            
            return azureMessage;
        }
        
        public async Task ResubmitDlqMessageAsync(string connectionString, string queue, Message message)
        {
            var azureMessage = await PeekDlqMessageBySequenceNumber(connectionString, queue, message.SequenceNumber);
            var clonedMessage = azureMessage.CloneMessage();

            await SendMessageAsync(connectionString, queue, clonedMessage);

            await DeleteMessageAsync(connectionString, queue, message, true);
        }
        
        public async Task<long> PurgeMessagesAsync(string connectionString, string queue, bool isDlq)
        {
            var path = isDlq ? EntityNameHelper.FormatDeadLetterPath(queue) : queue;

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
    }

    public interface IQueueHelper
    {
        Task<IList<string>> GetQueuesAsync(string connectionString);
        public Task SendMessageAsync(string connectionString, string topicPath, string content);
        public Task SendMessageAsync(string connectionString, string topicPath, AzureMessage message);
        Task<IList<Message>> GetMessagesAsync(string connectionString, string queueName);
        Task<IList<Message>> GetDlqMessagesAsync(string connectionString, string queueName);
        Task DeadletterMessageAsync(string connectionString, string queue, Message message);
        Task DeleteMessageAsync(string connectionString, string queue,
            Message message, bool isDlq);
        Task ResubmitDlqMessageAsync(string connectionString, string queue, Message message);
        Task<long> PurgeMessagesAsync(string connectionString, string queue, bool isDlq);
    }
}
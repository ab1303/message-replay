using System;
using System.Text;
using AzureMessage = Microsoft.Azure.ServiceBus.Message;

namespace MessageReplay.Api.Models
{
    public class Message
    {
        public string MessageId { get; set; }
        public string ContentType { get; set; }
        public string Content { get; set; }
        public long Size { get; set; }
        public string CorrelationId { get; set; }
        public int DeliveryCount { get; set; }
        public long SequenceNumber { get; set; }
        public TimeSpan TimeToLive { get; set; }
        public DateTime EnqueueTimeUtc { get; set; }
        public DateTime ExpiresAt { get; set; }
        public string DeadLetterReason { get; set; }
        public bool IsDlq { get; }
        
        public Message(AzureMessage azureMessage, bool isDlq)
        {
            this.Content = Encoding.UTF8.GetString(azureMessage.Body);
            this.MessageId = azureMessage.MessageId;
            this.CorrelationId = azureMessage.CorrelationId;
            this.DeliveryCount = azureMessage.SystemProperties.DeliveryCount;
            this.ContentType = azureMessage.ContentType;
            this.SequenceNumber = azureMessage.SystemProperties.SequenceNumber;
            this.Size = azureMessage.Size;
            this.TimeToLive = azureMessage.TimeToLive;
            this.IsDlq = isDlq;
            this.EnqueueTimeUtc = azureMessage.SystemProperties.EnqueuedTimeUtc;
            this.ExpiresAt = azureMessage.ExpiresAtUtc;
            this.DeadLetterReason = azureMessage.UserProperties.ContainsKey("DeadLetterReason")
                ? azureMessage.UserProperties["DeadLetterReason"].ToString()
                : string.Empty;
        }
    }
}
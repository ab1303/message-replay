using Microsoft.Azure.ServiceBus.Management;

namespace MessageReplay.Api.Models
{
    public class ServiceBusQueue
    {
        private readonly QueueRuntimeInfo _queueRuntimeInfo;

        public string Name { get; set; }
        public ServiceBusResource ServiceBus { get; set; }

        public long MessageCount
        {
            get => _queueRuntimeInfo.MessageCount;
        }

        public long DlqCount
        {
            get => _queueRuntimeInfo.MessageCountDetails.DeadLetterMessageCount;
        }

        public ServiceBusQueue(QueueRuntimeInfo queueRuntimeInfo)            
        {
            _queueRuntimeInfo = queueRuntimeInfo;
        }
    }
}
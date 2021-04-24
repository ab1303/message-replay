using Microsoft.Azure.ServiceBus.Management;

namespace MessageReplay.Api.Models
{
    public class ServiceBusSubscription
    {
        private readonly SubscriptionRuntimeInfo _subscriptionRuntimeInfo;

        public string Name { get; set; }
       
        public ServiceBusTopic Topic { get; set; }

        public long MessageCount
        {
            get => _subscriptionRuntimeInfo.MessageCount;
        }

        public long DlqCount
        {
            get => _subscriptionRuntimeInfo.MessageCountDetails.DeadLetterMessageCount;
        }

        public ServiceBusSubscription(SubscriptionRuntimeInfo subscription)        
        {
            Name = subscription.SubscriptionName;
            _subscriptionRuntimeInfo = subscription;
        }
    }
}
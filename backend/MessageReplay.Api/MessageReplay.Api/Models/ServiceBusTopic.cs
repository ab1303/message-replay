using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace MessageReplay.Api.Models
{
    public class ServiceBusTopic
    {
        public string Name { get; set; }
        public IEnumerable<ServiceBusSubscription> Subscriptions { get; private set; }
        public ServiceBusResource ServiceBus { get; set; }

    }
}
using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace MessageReplay.Api.Models
{
    public class ServiceBusResource 
    {
        public string Name { get; set; }
        public string ConnectionString { get; set; }
        public IEnumerable<ServiceBusQueue> Queues { get; set; }
        public IEnumerable<ServiceBusTopic> Topics { get; set; }
              
    }
}
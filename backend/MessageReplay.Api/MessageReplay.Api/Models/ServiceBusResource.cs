using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace MessageReplay.Api.Models
{
    public class ServiceBusResource 
    {
        public string Name { get; set; }
        public string ConnectionString { get; set; }
        public IEnumerable<string> Queues { get; set; }
        public IEnumerable<string> Topics { get; set; }
              
    }
}
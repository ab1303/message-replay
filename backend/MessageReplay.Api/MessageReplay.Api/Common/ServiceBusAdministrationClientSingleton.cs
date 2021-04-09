using Azure.Messaging.ServiceBus.Administration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MessageReplay.Api.Common
{

 
    public class ServiceBusAdministrationClientSingleton
    {
        private string _serviceBusConnectionString;
        private ServiceBusAdministrationClient _serviceBusAdminClient;

        private static readonly Lazy<ServiceBusAdministrationClientSingleton> lazy =
            new Lazy<ServiceBusAdministrationClientSingleton>(() => new ServiceBusAdministrationClientSingleton());

        public static ServiceBusAdministrationClientSingleton Instance { get => lazy.Value; }
        public string ConnectionString { get => _serviceBusConnectionString; }
        public ServiceBusAdministrationClient Client { get => _serviceBusAdminClient; }
        
        public void WithConnection(string connectionString)
        {
            _serviceBusAdminClient = new ServiceBusAdministrationClient(connectionString);
            _serviceBusConnectionString = connectionString;
        }
     
        private ServiceBusAdministrationClientSingleton()
        {

        }
    }
}

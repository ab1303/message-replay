using Microsoft.Azure.ServiceBus.Management;
using System;

namespace MessageReplay.Api.Common
{
    public class ServiceBusManagementClientSingleton
    {
        private string _serviceBusConnectionString;
        private ManagementClient _serviceBusManagementClient;

        private static readonly Lazy<ServiceBusManagementClientSingleton> lazy =
            new Lazy<ServiceBusManagementClientSingleton>(() => new ServiceBusManagementClientSingleton());

        public static ServiceBusManagementClientSingleton Instance { get => lazy.Value; }
        public string ConnectionString { get => _serviceBusConnectionString; }
        public ManagementClient Client { get => _serviceBusManagementClient; }

        public ServiceBusManagementClientSingleton WithConnection(string connectionString)
        {
            _serviceBusConnectionString = connectionString;
            return this;
        }

        public ManagementClient BuildClient()
        {
            _serviceBusManagementClient = new ManagementClient(_serviceBusConnectionString);
            return _serviceBusManagementClient;
        }

        private ServiceBusManagementClientSingleton()
        {

        }
    }
}

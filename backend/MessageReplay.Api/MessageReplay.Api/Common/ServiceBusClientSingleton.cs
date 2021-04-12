using Azure.Messaging.ServiceBus;
using System;

namespace MessageReplay.Api.Common
{
    public class ServiceBusClientSingleton
    {
        private string _serviceBusConnectionString;
        private ServiceBusClient _serviceBusClient;
        private ServiceBusClientOptions _serviceBusClientOptions;

        private static readonly Lazy<ServiceBusClientSingleton> lazy =
            new Lazy<ServiceBusClientSingleton>(() => new ServiceBusClientSingleton());

        public static ServiceBusClientSingleton Instance { get => lazy.Value; }
        public string ConnectionString { get => _serviceBusConnectionString; }
        public ServiceBusClient Client { get => _serviceBusClient; }

        public ServiceBusClientSingleton WithConnection(string connectionString)
        {
            _serviceBusConnectionString = connectionString;
            return this;
        }

        public ServiceBusClientSingleton WithOptions(ServiceBusClientOptions options)
        {
            _serviceBusClientOptions = options;
            return this;
        }

        public ServiceBusClient BuildClient()
        {
            _serviceBusClient = _serviceBusClientOptions != null
                ? new ServiceBusClient(_serviceBusConnectionString, _serviceBusClientOptions)
                : new ServiceBusClient(_serviceBusConnectionString);

            return _serviceBusClient;
        }

        private ServiceBusClientSingleton()
        {

        }
    }
}

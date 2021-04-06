using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MessageReplay.Api.Services
{
   
    public interface IGlobalSettings
    {
        string ServiceBusConnectionString { get; set; }
    }

    public class GlobalSettings : IGlobalSettings
    {
        private string _serviceBusConnectionString { get; set; }
        string IGlobalSettings.ServiceBusConnectionString
        {
            get => _serviceBusConnectionString;
            set => _serviceBusConnectionString = value;
        }
    }
}

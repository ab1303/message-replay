namespace MessageReplay.Api.Features.Settings
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

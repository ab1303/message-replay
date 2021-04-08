using Azure.Messaging.ServiceBus.Administration;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MessageReplay.Api.Features.Settings
{

    [ApiController]
    [Produces("application/json")]
    [Route("api/[controller]")]

    public class SettingsController : ControllerBase
    {
        private readonly IGlobalSettings _globalSettings;
        private readonly ILogger<SettingsController> _logger;


        public int ServerTimeout { get; set; } = 5;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="globalSettings"></param>
        /// <param name="logger"></param>
        public SettingsController(IGlobalSettings globalSettings, ILogger<SettingsController> logger)
        {
            _globalSettings = globalSettings;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> SaveAppSettings(SaveAppSettingsRequest request)
        {
            var queueList = new List<string>();
            var topicList = new List<string>();
            var adminClient = new ServiceBusAdministrationClient(request.ConnectionString);

            var queues = adminClient.GetQueuesAsync();
            var topics = adminClient.GetTopicsAsync();


            await foreach (var queueProp in queues)
            {
                queueList.Add(queueProp.Name);
            }

            await foreach (var topicProp in topics)
            {
                topicList.Add(topicProp.Name);
            }

            _globalSettings.ServiceBusConnectionString = request.ConnectionString;
            return Ok( new
            {
                queues = queueList,
                topics = topicList
            });
        }

        [HttpGet]
        public IActionResult FetchAppSettings()
        {
            return Ok(new FetchAppSettingsResponse
            {
                ConnectionString = _globalSettings.ServiceBusConnectionString
            });
        }
     
    }
}

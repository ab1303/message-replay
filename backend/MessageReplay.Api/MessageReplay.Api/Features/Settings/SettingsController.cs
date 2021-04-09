using Azure.Messaging.ServiceBus.Administration;
using MessageReplay.Api.Common;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MessageReplay.Api.Features.Settings
{

    [ApiController]
    [Produces("application/json")]
    [Route("api/[controller]")]

    // TODO: Change from Settings -> Connection
    public class SettingsController : ControllerBase
    {
        private readonly ILogger<SettingsController> _logger;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="logger"></param>
        public SettingsController(ILogger<SettingsController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> SaveAppSettings(SaveAppSettingsRequest request)
        {
            ServiceBusAdministrationClientSingleton.Instance
                .WithConnection(request.ConnectionString);


            var queueList = new List<string>();
            var topicList = new List<string>();
            var adminClient = ServiceBusAdministrationClientSingleton.Instance.Client;

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
                ConnectionString = ServiceBusAdministrationClientSingleton.Instance.ConnectionString
            });
        }
     
    }
}

using MessageReplay.Api.Common;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MessageReplay.Api.Helpers;
using System.Threading.Tasks;
using MessageReplay.Api.Models;

namespace MessageReplay.Api.Features.Settings
{

    [ApiController]
    [Produces("application/json")]
    [Route("api/[controller]")]

    // TODO: Change from Settings -> Connection
    public class SettingsController : ControllerBase
    {
        private readonly ILogger<SettingsController> _logger;
        private readonly IQueueHelper _queueHelper;
        private readonly ITopicHelper _topicHelper;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="queueHelper"></param>
        /// <param name="topicHelper"></param>
        public SettingsController(ILogger<SettingsController> logger, IQueueHelper queueHelper, ITopicHelper topicHelper)
        {
            _logger = logger;
            _queueHelper = queueHelper;
            _topicHelper = topicHelper;
        }

        [HttpPost]
        public async Task<IActionResult> SaveAppSettings(SaveAppSettingsRequest request)
        {   
            // TODO: Change to ServiceBusResourceSingleton
            ServiceBusClientSingleton.Instance
                .WithConnection(request.ConnectionString)
                .BuildClient()
                ;

            ServiceBusManagementClientSingleton.Instance
             .WithConnection(request.ConnectionString)
             .BuildClient()
             ;

            var namespaceInfo = await _topicHelper.GetNamespaceInfoAsync(request.ConnectionString);
            var queues = await _queueHelper.GetQueuesAsync(request.ConnectionString);
            var topics = await _topicHelper.GetTopicsAsync(request.ConnectionString);

            return Ok(new ServiceBusResource
            {
                Name = namespaceInfo.Name,
                ConnectionString = request.ConnectionString,
                Queues = queues,
                Topics = topics,
            });
        }

        [HttpGet]
        public IActionResult FetchAppSettings()
        {
            return Ok(new FetchAppSettingsResponse
            {
                ConnectionString = ServiceBusClientSingleton.Instance.ConnectionString
            });
        }

    }
}

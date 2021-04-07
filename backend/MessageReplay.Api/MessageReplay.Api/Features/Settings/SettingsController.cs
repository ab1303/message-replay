using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace MessageReplay.Api.Features.Settings
{

    [ApiController]
    [Produces("application/json")]
    [Route("api/[controller]")]

    public class SettingsController : ControllerBase
    {
        private readonly IGlobalSettings _globalSettings;
        private readonly ILogger<SettingsController> _logger;

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
        public IActionResult SaveAppSettings(SaveAppSettingsRequest request)
        {
            _globalSettings.ServiceBusConnectionString = request.ConnectionString;
            return Ok();
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

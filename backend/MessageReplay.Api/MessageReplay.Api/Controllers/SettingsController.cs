using MessageReplay.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace MessageReplay.Api.Controllers
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
        public IActionResult SaveGlobalSettings(string sbConnectionString)
        {
            _globalSettings.ServiceBusConnectionString = sbConnectionString;
            return Ok();
        }

        [HttpGet]
        public IActionResult FetchGlobalSettings()
        {
            return Ok(new
            {
                ServiceBusConnectionString = _globalSettings.ServiceBusConnectionString
            });
        }
    }
}

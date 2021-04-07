using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MessageReplay.Api.Features.Settings
{
    public class SaveAppSettingsRequest
    {
        public string ConnectionString { get; set; }
    }
}

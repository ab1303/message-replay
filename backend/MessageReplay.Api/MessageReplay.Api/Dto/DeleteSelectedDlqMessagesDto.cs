using System;
using System.Collections.Generic;

namespace MessageReplay.Api.Dto
{
    public class DeleteSelectedDlqMessagesDto
    {
        public DateTime LockedUntilUtc { get; set; }
        public List<string> FailedMessageIds { get; set; }
    }
}

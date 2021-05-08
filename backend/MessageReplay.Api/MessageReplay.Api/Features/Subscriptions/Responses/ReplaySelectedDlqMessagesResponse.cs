using System;
using System.Collections.Generic;

namespace MessageReplay.Api.Features.Subscriptions.Responses
{
    public class ReplaySelectedDlqMessagesResponse
    {
        public DateTime LockedUntilUtc { get; set; }
        public List<string> FailedMessageIds { get; set; }
    }
}

namespace MessageReplay.Api.Features.Subscriptions.Requests
{
    public class ResubmitSelectedDeadLettersRequest
    {
        public string[] MessageIds { get; set; }
    }
}

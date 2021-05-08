namespace MessageReplay.Api.Features.Subscriptions.Requests
{
    public class ReplaySelectedDeadLettersRequest
    {
        public string[] MessageIds { get; set; }
    }
}

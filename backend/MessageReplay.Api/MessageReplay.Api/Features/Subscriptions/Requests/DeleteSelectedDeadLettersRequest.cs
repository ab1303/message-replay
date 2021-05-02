namespace MessageReplay.Api.Features.Subscriptions.Requests
{
    public class DeleteSelectedDeadLettersRequest
    {
        public string[] MessageIds { get; set; }
    }
}

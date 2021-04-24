using AutoMapper;
using MessageReplay.Api.Features.Topics.Responses;
using MessageReplay.Api.Models;

namespace MessageReplay.Api.Features.Subscriptions.AutoMapper
{
    public class SubscriptionsProfile : Profile
    {
        public SubscriptionsProfile()
        {
            CreateMap<Message, GetSubscriptionMessage>();
            CreateMap<Message, GetSubscriptionDeadLetter>();
        }
    }
}

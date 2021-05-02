using AutoMapper;
using MessageReplay.Api.Dto;
using MessageReplay.Api.Features.Subscriptions.Responses;
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
            CreateMap<DeleteSelectedDlqMessagesDto, DeleteSelectedDlqMessagesResponse>();
        }
    }
}

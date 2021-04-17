using AutoMapper;
using MessageReplay.Api.Features.Subscriptions.Queries;
using MessageReplay.Api.Features.Topics.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MessageReplay.Api.Features.Subscriptions.AutoMapper
{
    public class SubscriptionsProfile : Profile
    {
        public SubscriptionsProfile()
        {
            CreateMap<GetSubscriptionMessageDto, GetSubscriptionMessage>();
            CreateMap<GetSubscriptionDeadLetterDto, GetSubscriptionDeadLetter>();
        }
    }
}

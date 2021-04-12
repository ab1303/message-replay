using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MessageReplay.Api.Common.Infrastructure
{
    public interface IQueryHandlerAsync<in T, TResult>
    {
        Task<TResult> GetResultAsync(T query);
    }
}

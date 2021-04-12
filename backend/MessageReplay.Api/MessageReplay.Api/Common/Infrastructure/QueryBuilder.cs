using MessageReplay.Api.Common.Enums;
using MessageReplay.Api.Common.Infrastructure;

namespace MessageReplay.Api.Features.Subscriptions.Queries
{
    public class QueryBuilder
    {
        private (int pageNumber, int size) _pagination;

        public Query BuildQuery()
        {
            var pageNumber = _pagination.pageNumber < 1
                ? QueryDefaults.DefaultPageNumber
                : _pagination.pageNumber;

            var pageSize = _pagination.size > QueryDefaults.DefaultPageSize
                ? QueryDefaults.MaxPageSize
                : _pagination.size;

            return new Query((pageNumber, pageSize));
        }

        public QueryBuilder WithPagination(int pageNumber, int pageSize)
        {
            _pagination = (pageNumber, pageSize);
            return this;
        }
       
    }
}

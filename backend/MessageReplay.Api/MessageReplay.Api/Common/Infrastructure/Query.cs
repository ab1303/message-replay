using MessageReplay.Api.Common.Enums;

namespace MessageReplay.Api.Common.Infrastructure
{
    
    public class Query
    {
        public Query((int pageNumber, int size) pagination)
        {
            Pagination = pagination;
        }
        public (int pageNumber, int size) Pagination { get; }

    }
}

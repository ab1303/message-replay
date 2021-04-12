using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MessageReplay.Api.Common.Infrastructure
{
    public class QueryDefaults
    {
        public const int MaxPageSize = 25;
        public const int DefaultPageNumber = 1;
        public const int DefaultPageSize = 10;

        /// <summary>
        /// Current page number
        /// </summary>
        public int PageNumber { get; set; } = DefaultPageNumber;

        private int _pageSize = DefaultPageSize;

        /// <summary>
        /// Number of items on page
        /// </summary>
        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
        }
    }
}

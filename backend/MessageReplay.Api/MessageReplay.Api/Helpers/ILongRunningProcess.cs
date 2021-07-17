using System.Threading.Tasks;
using MessageReplay.Api.Common;

namespace MessageReplay.Api.Helpers
{
    public interface ILongRunningProcess
    {
        Task<LongRunningProcessResponse> GetStatus(string topicName, string subscriptionName);
        void StartLongRunningProcess(string connectionString, string topicName, string subscriptionName);
    }
}
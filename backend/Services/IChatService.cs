using System.Threading.Tasks;

namespace GovPortal.API.Services
{
    public interface IChatService
    {
        Task<string> ProcessMessageAsync(string sessionId, string message);
    }
}

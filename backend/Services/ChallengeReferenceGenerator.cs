using System;
using System.Threading.Tasks;
using GovPortal.API.Data;
using Microsoft.EntityFrameworkCore;

namespace GovPortal.API.Services
{
    public interface IChallengeReferenceGenerator
    {
        Task<string> GenerateReferenceNumberAsync();
    }

    public class ChallengeReferenceGenerator : IChallengeReferenceGenerator
    {
        private readonly ApplicationDbContext _context;

        public ChallengeReferenceGenerator(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<string> GenerateReferenceNumberAsync()
        {
            var year = DateTime.UtcNow.Year;
            var prefix = $"MH-CH-{year}-";

            // In a real high-concurrency production environment, we would use a database sequence object.
            // For this phase, we use a count or max query on the existing reference numbers.
            var latestChallenge = await _context.Challenges
                .Where(c => c.ChallengeReferenceNumber.StartsWith(prefix))
                .OrderByDescending(c => c.ChallengeReferenceNumber)
                .FirstOrDefaultAsync();

            int nextSequence = 1;
            if (latestChallenge != null)
            {
                var lastSequenceStr = latestChallenge.ChallengeReferenceNumber.Substring(prefix.Length);
                if (int.TryParse(lastSequenceStr, out int lastSequence))
                {
                    nextSequence = lastSequence + 1;
                }
            }

            return $"{prefix}{nextSequence:D5}";
        }
    }
}

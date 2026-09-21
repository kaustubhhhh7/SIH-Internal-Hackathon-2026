using System;
using System.Linq;
using System.Threading.Tasks;
using GovPortal.API.Data;
using GovPortal.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace GovPortal.API.Services
{
    public class LocalRagChatService : IChatService
    {
        private readonly ApplicationDbContext _context;

        public LocalRagChatService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<string> ProcessMessageAsync(string sessionId, string message)
        {
            // 1. Log the user message
            var session = await GetOrCreateSessionAsync(sessionId);
            var userMessage = new ChatMessage
            {
                ChatSessionId = session.Id,
                Sender = "user",
                Text = message,
                Timestamp = DateTime.UtcNow
            };
            _context.ChatMessages.Add(userMessage);

            // 2. Normalize message for matching
            var lowerMessage = message.ToLowerInvariant();
            
            // 3. Search Knowledge Base (Simulated RAG)
            var knowledgeItems = await _context.KnowledgeBase
                .Where(k => k.IsVerified)
                .ToListAsync();

            // Simple heuristic keyword matching
            KnowledgeItem? bestMatch = null;
            int maxScore = 0;

            foreach (var item in knowledgeItems)
            {
                int score = 0;
                
                // Direct question match
                if (lowerMessage.Contains(item.Question.ToLowerInvariant())) score += 10;
                
                // Keyword matches
                var keywords = item.Keywords.Split(',').Select(k => k.Trim().ToLowerInvariant());
                foreach (var kw in keywords)
                {
                    if (lowerMessage.Contains(kw)) score += 2;
                }

                if (score > maxScore)
                {
                    maxScore = score;
                    bestMatch = item;
                }
            }

            string responseText = "";

            // 4. Decide response based on confidence (score)
            if (bestMatch != null && maxScore >= 4) // Arbitrary confidence threshold
            {
                responseText = bestMatch.Answer;
                if (!string.IsNullOrEmpty(bestMatch.Source))
                {
                    responseText += $"\n\n*Source: {bestMatch.Source}*";
                }
            }
            else
            {
                // Fallback & save unanswered question
                responseText = "I couldn't find verified information for that question in the current knowledge base.\n\nYou can:\n• Rephrase your question\n• Ask about startup registration, eligibility or procurement\n• Contact portal support\n\nYour question has been recorded and will be reviewed by the administrator.";
                
                var unanswered = new UnansweredQuestion
                {
                    Question = message,
                    Category = "Auto-Logged",
                    Status = "Pending",
                    CreatedAt = DateTime.UtcNow
                };
                _context.UnansweredQuestions.Add(unanswered);
            }

            // 5. Log the bot response
            var botMessage = new ChatMessage
            {
                ChatSessionId = session.Id,
                Sender = "bot",
                Text = responseText,
                Timestamp = DateTime.UtcNow
            };
            _context.ChatMessages.Add(botMessage);

            await _context.SaveChangesAsync();

            return responseText;
        }

        private async Task<ChatSession> GetOrCreateSessionAsync(string sessionId)
        {
            var session = await _context.ChatSessions
                .FirstOrDefaultAsync(s => s.SessionId == sessionId);

            if (session == null)
            {
                session = new ChatSession
                {
                    SessionId = sessionId,
                    CreatedAt = DateTime.UtcNow
                };
                _context.ChatSessions.Add(session);
                await _context.SaveChangesAsync();
            }

            return session;
        }
    }
}

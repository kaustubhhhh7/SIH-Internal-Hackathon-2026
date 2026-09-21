using System;
using System.Linq;
using System.Threading.Tasks;
using GovPortal.API.Data;
using GovPortal.API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GovPortal.API.Controllers
{
    [ApiController]
    [Route("api/admin/[controller]")]
    // [Authorize(Roles = "ADMINISTRATOR")] // Disabled temporarily for demo if needed
    public class KnowledgeController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public KnowledgeController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("unanswered")]
        public async Task<IActionResult> GetUnansweredQuestions()
        {
            var questions = await _context.UnansweredQuestions
                .Where(q => q.Status == "Pending")
                .OrderByDescending(q => q.CreatedAt)
                .ToListAsync();
                
            return Ok(questions);
        }

        [HttpPost("unanswered/{id}/resolve")]
        public async Task<IActionResult> ResolveUnansweredQuestion(Guid id, [FromBody] ResolveQuestionRequest request)
        {
            var question = await _context.UnansweredQuestions.FindAsync(id);
            if (question == null) return NotFound();

            question.AdminAnswer = request.Answer;
            question.Status = "Resolved";
            question.ResolvedAt = DateTime.UtcNow;

            var newKnowledge = new KnowledgeItem
            {
                Question = question.Question,
                Answer = request.Answer,
                Category = question.Category,
                Keywords = string.Join(", ", question.Question.Split(' ').Where(w => w.Length > 3)),
                Source = "Admin Verification",
                IsVerified = true
            };

            _context.KnowledgeBase.Add(newKnowledge);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Question resolved and added to Knowledge Base." });
        }
        
        [HttpGet]
        public async Task<IActionResult> GetKnowledgeBase()
        {
            var items = await _context.KnowledgeBase
                .OrderByDescending(k => k.CreatedAt)
                .ToListAsync();
            return Ok(items);
        }
    }

    public class ResolveQuestionRequest
    {
        public string Answer { get; set; } = string.Empty;
    }
}

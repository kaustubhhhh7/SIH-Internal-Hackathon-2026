using System;
using System.Threading.Tasks;
using GovPortal.API.DTOs;
using GovPortal.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GovPortal.API.Controllers
{
    [ApiController]
    [Route("api/ai")]
    [AllowAnonymous]
    public class AiAgentsController : ControllerBase
    {
        private readonly IAgentOrchestratorService _agentService;

        public AiAgentsController(IAgentOrchestratorService agentService)
        {
            _agentService = agentService;
        }

        /// <summary>
        /// AGENT 1: RFP Agent - Parses unstructured departmental complaints into a structured GFR-compliant RFP
        /// </summary>
        [HttpPost("parse-rfp")]
        public async Task<ActionResult<ParseRfpResponse>> ParseRfp([FromBody] ParseRfpRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.RawProblemText))
            {
                return BadRequest(new { message = "Raw problem statement text is required" });
            }

            var result = await _agentService.ParseRfpAsync(request.RawProblemText);
            return Ok(result);
        }

        /// <summary>
        /// AGENT 2: Verification Agent - Deterministic verification of startup credentials (DPIIT, GSTIN, CIN, GFR 149 EMD exemption)
        /// </summary>
        [HttpPost("verify-startup/{startupId}")]
        public async Task<ActionResult<VerifyStartupResponse>> VerifyStartup(string startupId)
        {
            Guid id;
            if (!Guid.TryParse(startupId, out id))
            {
                // Fallback deterministic Guid if demo ID is passed
                id = Guid.Empty;
            }

            var result = await _agentService.VerifyStartupAsync(id);
            return Ok(result);
        }

        /// <summary>
        /// AGENT 3: Scoring Agent - Calculates double-blind innovation & Swadeshi score
        /// Formula: Score = (TRL Level * 10) + (Swadeshi % * 0.3) + (KPI Compliance % * 0.4)
        /// </summary>
        [HttpGet("score-bid/{bidId}")]
        public async Task<ActionResult<ScoreBidResponse>> ScoreBid(string bidId)
        {
            Guid id;
            if (!Guid.TryParse(bidId, out id))
            {
                id = Guid.Empty;
            }

            var result = await _agentService.ScoreBidAsync(id);
            return Ok(result);
        }

        /// <summary>
        /// AGENT 4: Executive Briefing Agent - Synthesizes 90-day pilot performance into a 1-page Markdown Executive Brief
        /// </summary>
        [HttpPost("generate-brief/{trialId}")]
        public async Task<ActionResult<ExecutiveBriefResponse>> GenerateBrief(string trialId)
        {
            Guid id;
            if (!Guid.TryParse(trialId, out id))
            {
                id = Guid.Empty;
            }

            var result = await _agentService.GenerateBriefAsync(id);
            return Ok(result);
        }
    }
}

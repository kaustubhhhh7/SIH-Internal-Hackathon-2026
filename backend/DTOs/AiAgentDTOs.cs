using System;
using System.Collections.Generic;

namespace GovPortal.API.DTOs
{
    public class ParseRfpRequest
    {
        public string RawProblemText { get; set; } = string.Empty;
    }

    public class ParseRfpResponse
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<string> TargetKpis { get; set; } = new();
        public decimal SuggestedGrantCap { get; set; }
        public int RecommendedTrl { get; set; }
        public string Sector { get; set; } = "Urban Development";
        public string GeographicScope { get; set; } = string.Empty;
        public string TargetBeneficiaries { get; set; } = string.Empty;
        public string CurrentSituation { get; set; } = string.Empty;
        public string DesiredOutcome { get; set; } = string.Empty;
        public string ExpectedDeliverables { get; set; } = string.Empty;
        public string FunctionalRequirements { get; set; } = string.Empty;
        public string TechnicalRequirements { get; set; } = string.Empty;
        public string EligibilityRequirements { get; set; } = string.Empty;
        public string DataRequirements { get; set; } = string.Empty;
        public string CybersecurityRequirements { get; set; } = string.Empty;
        public string IntellectualPropertyRequirements { get; set; } = string.Empty;
        public string PilotDuration { get; set; } = string.Empty;
    }

    public class VerifyStartupResponse
    {
        public bool IsGenuine { get; set; }
        public List<string> ChecksPassed { get; set; } = new();
        public List<string> Warnings { get; set; } = new();
    }

    public class ScoreBidResponse
    {
        public double MatchScore { get; set; }
        public int TrlRating { get; set; }
        public double SwadeshiPercentage { get; set; }
        public string Verdict { get; set; } = "High Priority"; // "High Priority", "Medium Priority", "Ineligible"
    }

    public class ExecutiveBriefResponse
    {
        public string MarkdownBrief { get; set; } = string.Empty;
    }
}

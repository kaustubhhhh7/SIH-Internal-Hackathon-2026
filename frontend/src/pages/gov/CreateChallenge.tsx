import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight, ChevronLeft, Save, Send, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { govChallengeApi, type CreateChallengeDto } from '../../services/api/challenges';
import { aiAgentsApi } from '../../services/api/aiAgents';

const CreateChallenge = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [rawProblemText, setRawProblemText] = useState('');
  const [isAiStructuring, setIsAiStructuring] = useState(false);
  const [aiSuccessMessage, setAiSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateChallengeDto>({
    titleEnglish: '',
    titleMarathi: '',
    sector: 'Health',
    geographicScope: 'Statewide',
    targetBeneficiaries: '',
    problemStatementEnglish: '',
    problemStatementMarathi: '',
    backgroundEnglish: '',
    backgroundMarathi: '',
    currentSituation: '',
    desiredOutcomeEnglish: '',
    desiredOutcomeMarathi: '',
    expectedDeliverables: '',
    functionalRequirements: '',
    technicalRequirements: '',
    eligibilityRequirements: '',
    pilotRequirement: false,
    pilotDuration: '',
    dataRequirements: '',
    cybersecurityRequirements: '',
    intellectualPropertyRequirements: 'Government of Maharashtra will retain usage rights.',
    procurementExpectation: '',
    estimatedBudget: null,
    fundingType: 'Grant',
    publicationDate: null,
    submissionOpeningDate: null,
    submissionClosingDate: null,
    technologyCategoryIds: []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const steps = [
    { id: 1, title: 'Basic Info' },
    { id: 2, title: 'Problem Definition' },
    { id: 3, title: 'Outcomes' },
    { id: 4, title: 'Eligibility & Pilot' },
    { id: 5, title: 'Data & IP' },
    { id: 6, title: 'Timeline' },
    { id: 7, title: 'Review' }
  ];

  const handleNext = () => {
    if (currentStep < 7) setCurrentStep(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const payload: CreateChallengeDto = {
        ...formData,
        estimatedBudget: formData.estimatedBudget ? Number(formData.estimatedBudget) : null,
        publicationDate: formData.publicationDate ? new Date(formData.publicationDate).toISOString() : null,
        submissionOpeningDate: formData.submissionOpeningDate ? new Date(formData.submissionOpeningDate).toISOString() : null,
        submissionClosingDate: formData.submissionClosingDate ? new Date(formData.submissionClosingDate).toISOString() : null,
        technologyCategoryIds: formData.technologyCategoryIds || []
      };

      await govChallengeApi.createChallenge(payload);
      navigate('/gov/dashboard');
    } catch (err: any) {
      console.error('Challenge creation failed:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create challenge');
      setIsSubmitting(false);
    }
  };

  const handleAutoStructureRfp = async () => {
    if (!rawProblemText.trim()) {
      setError('Please enter a raw departmental problem statement to auto-structure');
      return;
    }
    setIsAiStructuring(true);
    setAiSuccessMessage(null);
    setError('');

    try {
      const parsed = await aiAgentsApi.parseRfp(rawProblemText);
      setFormData(prev => ({
        ...prev,
        titleEnglish: parsed.title,
        sector: parsed.sector,
        geographicScope: parsed.geographicScope,
        targetBeneficiaries: parsed.targetBeneficiaries,
        problemStatementEnglish: parsed.description,
        currentSituation: parsed.currentSituation,
        desiredOutcomeEnglish: parsed.desiredOutcome,
        expectedDeliverables: parsed.expectedDeliverables,
        technicalRequirements: parsed.technicalRequirements,
        functionalRequirements: parsed.functionalRequirements,
        eligibilityRequirements: parsed.eligibilityRequirements,
        dataRequirements: parsed.dataRequirements,
        cybersecurityRequirements: parsed.cybersecurityRequirements,
        intellectualPropertyRequirements: parsed.intellectualPropertyRequirements,
        pilotRequirement: true,
        pilotDuration: parsed.pilotDuration || '90 Days',
        estimatedBudget: parsed.suggestedGrantCap
      }));
      setAiSuccessMessage(`✨ Autonomous RFP Agent successfully structured the challenge! Auto-populated: Title, Sector, Geo-Scope, Beneficiaries, Current Situation, ${parsed.targetKpis.length} Target KPIs, TRL ${parsed.recommendedTrl}, and Grant Budget (₹${parsed.suggestedGrantCap.toLocaleString('en-IN')}).`);
    } catch (err: any) {
      console.error('AI Auto-Structure failed:', err);
      setError(err?.message || 'Failed to auto-structure RFP');
    } finally {
      setIsAiStructuring(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* AI RFP Agent Assistant Box */}
            <div className="bg-gradient-to-br from-indigo-50/80 via-blue-50/50 to-purple-50/60 border border-indigo-200 rounded-lg p-5 shadow-xs">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                      Autonomous RFP Structuring Agent (GFR Rule 149)
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      Paste unstructured departmental complaints or field memos. The AI Agent structures it into GFR-compliant RFP parameters.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3 space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Raw Departmental Problem Statement
                </label>
                <textarea
                  value={rawProblemText}
                  onChange={(e) => setRawProblemText(e.target.value)}
                  placeholder="e.g. Severe traffic jams and waterlogging at Dadar junction every monsoon. Need automated camera detection for potholes and water depth to alert ward staff before citizens complain..."
                  className="input-field h-24 text-xs font-normal bg-white"
                  disabled={isAiStructuring}
                />
              </div>

              <div className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="text-[11px] text-indigo-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Agent 1: Extracts Title, GFR KPIs, Grant Budget & TRL automatically
                </div>
                <button
                  type="button"
                  onClick={handleAutoStructureRfp}
                  disabled={isAiStructuring || !rawProblemText.trim()}
                  className="px-4 py-2 text-xs font-bold bg-indigo-700 hover:bg-indigo-800 disabled:bg-indigo-300 text-white rounded-md shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isAiStructuring ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>RFP Agent Structuring...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>🪄 Auto-Structure RFP with AI Agent</span>
                    </>
                  )}
                </button>
              </div>

              {aiSuccessMessage && (
                <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md text-xs font-medium flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{aiSuccessMessage}</span>
                </div>
              )}
            </div>

            <h3 className="text-section-title">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-small font-medium text-gray-700 mb-1">Title (English) *</label>
                <input type="text" name="titleEnglish" value={formData.titleEnglish} onChange={handleChange} className="input-field" required />
              </div>
              <div>
                <label className="block text-small font-medium text-gray-700 mb-1">Title (Marathi)</label>
                <input type="text" name="titleMarathi" value={formData.titleMarathi} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-small font-medium text-gray-700 mb-1">Sector *</label>
                <select name="sector" value={formData.sector} onChange={handleChange} className="input-field">
                  <option value="Health">Health</option>
                  <option value="Education">Education</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Urban Development">Urban Development</option>
                  <option value="Transport">Transport</option>
                </select>
              </div>
              <div>
                <label className="block text-small font-medium text-gray-700 mb-1">Geographic Scope</label>
                <input type="text" name="geographicScope" value={formData.geographicScope} onChange={handleChange} className="input-field" />
              </div>
            </div>
            <div>
              <label className="block text-small font-medium text-gray-700 mb-1">Target Beneficiaries</label>
              <textarea name="targetBeneficiaries" value={formData.targetBeneficiaries} onChange={handleChange} className="input-field h-24" />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-section-title">Problem Definition</h3>
            <div>
              <label className="block text-small font-medium text-gray-700 mb-1">Problem Statement (English) *</label>
              <textarea name="problemStatementEnglish" value={formData.problemStatementEnglish} onChange={handleChange} className="input-field h-32" required />
            </div>
            <div>
              <label className="block text-small font-medium text-gray-700 mb-1">Problem Statement (Marathi)</label>
              <textarea name="problemStatementMarathi" value={formData.problemStatementMarathi} onChange={handleChange} className="input-field h-32" />
            </div>
            <div>
              <label className="block text-small font-medium text-gray-700 mb-1">Current Situation</label>
              <textarea name="currentSituation" value={formData.currentSituation} onChange={handleChange} className="input-field h-24" />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-section-title">Outcomes & Requirements</h3>
            <div>
              <label className="block text-small font-medium text-gray-700 mb-1">Desired Outcome (English) *</label>
              <textarea name="desiredOutcomeEnglish" value={formData.desiredOutcomeEnglish} onChange={handleChange} className="input-field h-24" required />
            </div>
            <div>
              <label className="block text-small font-medium text-gray-700 mb-1">Expected Deliverables</label>
              <textarea name="expectedDeliverables" value={formData.expectedDeliverables} onChange={handleChange} className="input-field h-24" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-small font-medium text-gray-700 mb-1">Functional Requirements</label>
                <textarea name="functionalRequirements" value={formData.functionalRequirements} onChange={handleChange} className="input-field h-32" />
              </div>
              <div>
                <label className="block text-small font-medium text-gray-700 mb-1">Technical Requirements</label>
                <textarea name="technicalRequirements" value={formData.technicalRequirements} onChange={handleChange} className="input-field h-32" />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-section-title">Eligibility & Pilot</h3>
            <div>
              <label className="block text-small font-medium text-gray-700 mb-1">Eligibility Requirements</label>
              <textarea name="eligibilityRequirements" value={formData.eligibilityRequirements} onChange={handleChange} className="input-field h-24" />
            </div>
            <div className="flex items-center space-x-3 p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <input type="checkbox" id="pilotRequirement" name="pilotRequirement" checked={formData.pilotRequirement} onChange={handleChange} className="w-5 h-5 text-gov-blue rounded focus:ring-gov-blue" />
              <label htmlFor="pilotRequirement" className="text-small font-medium text-gray-800">Requires a Controlled Pilot/Sandbox Execution before full procurement</label>
            </div>
            {formData.pilotRequirement && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-small font-medium text-gray-700 mb-1">Pilot Duration</label>
                  <input type="text" name="pilotDuration" placeholder="e.g. 3 Months" value={formData.pilotDuration} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="block text-small font-medium text-gray-700 mb-1">Funding Type</label>
                  <select name="fundingType" value={formData.fundingType} onChange={handleChange} className="input-field">
                    <option value="Grant">Grant</option>
                    <option value="Paid Pilot">Paid Pilot</option>
                    <option value="No Funding">No Funding</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-section-title">Data, Security & IP</h3>
            <div>
              <label className="block text-small font-medium text-gray-700 mb-1">Data Requirements</label>
              <textarea name="dataRequirements" value={formData.dataRequirements} onChange={handleChange} className="input-field h-24" />
            </div>
            <div>
              <label className="block text-small font-medium text-gray-700 mb-1">Cybersecurity Requirements</label>
              <textarea name="cybersecurityRequirements" value={formData.cybersecurityRequirements} onChange={handleChange} className="input-field h-24" />
            </div>
            <div>
              <label className="block text-small font-medium text-gray-700 mb-1">Intellectual Property Requirements</label>
              <textarea name="intellectualPropertyRequirements" value={formData.intellectualPropertyRequirements} onChange={handleChange} className="input-field h-24" />
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-section-title">Timeline</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-small font-medium text-gray-700 mb-1">Target Publication Date</label>
                <input type="date" name="publicationDate" value={formData.publicationDate || ''} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-small font-medium text-gray-700 mb-1">Submission Opening</label>
                <input type="date" name="submissionOpeningDate" value={formData.submissionOpeningDate || ''} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-small font-medium text-gray-700 mb-1">Submission Closing</label>
                <input type="date" name="submissionClosingDate" value={formData.submissionClosingDate || ''} onChange={handleChange} className="input-field" />
              </div>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-6">
            <h3 className="text-section-title">Review Application</h3>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-4">
              <div>
                <h4 className="text-caption font-semibold text-gray-500 uppercase">Title</h4>
                <p className="text-card-title text-gray-900">{formData.titleEnglish || 'Not specified'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-caption font-semibold text-gray-500 uppercase">Sector</h4>
                  <p className="text-body text-gray-900">{formData.sector}</p>
                </div>
                <div>
                  <h4 className="text-caption font-semibold text-gray-500 uppercase">Pilot Required?</h4>
                  <p className="text-body text-gray-900">{formData.pilotRequirement ? 'Yes' : 'No'}</p>
                </div>
              </div>
              <div>
                <h4 className="text-caption font-semibold text-gray-500 uppercase">Problem Statement</h4>
                <p className="text-body text-gray-900 whitespace-pre-wrap">{formData.problemStatementEnglish || 'Not specified'}</p>
              </div>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fadeIn">
      <div className="mb-8">
        <h2 className="text-page-title text-gray-900">Create Innovation Challenge</h2>
        <p className="text-body text-gray-600 mt-1">Define the problem statement and requirements for startups.</p>
      </div>

      {/* Stepper */}
      <div className="mb-8 bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
        <div className="relative flex items-center justify-between">
          {/* Background Connecting Line */}
          <div className="absolute top-5 left-6 right-6 h-0.5 bg-gray-200 -z-0">
            <div 
              className="h-full bg-gov-blue transition-all duration-300"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />
          </div>

          {steps.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            return (
              <div key={step.id} className="flex flex-col items-center relative z-10 flex-1">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-xs border-2 
                    ${isCompleted 
                      ? 'bg-emerald-600 border-emerald-600 text-white' 
                      : isCurrent 
                        ? 'bg-gov-blue border-gov-blue text-white ring-4 ring-blue-100' 
                        : 'bg-white border-gray-300 text-gray-500'}`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.id}
                </div>
                <span className={`text-[11px] sm:text-xs mt-2 font-medium text-center transition-colors px-1 ${
                  isCurrent 
                    ? 'text-gov-blue font-bold' 
                    : isCompleted 
                      ? 'text-gray-800' 
                      : 'text-gray-400'
                }`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card">
        <form onSubmit={currentStep === 7 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
          
          <div className="min-h-[400px]">
            {renderStepContent()}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 1 || isSubmitting}
              className={`px-4 py-2 border border-gray-300 rounded-md shadow-sm text-nav text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gov-blue ${currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ChevronLeft className="w-4 h-4 inline mr-1" />
              Previous
            </button>
            
            <div className="space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-nav text-gov-blue bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gov-blue"
              >
                <Save className="w-4 h-4 inline mr-1" />
                Save Draft
              </button>
              
              {currentStep < 7 ? (
                <button
                  type="submit"
                  className="px-6 py-2 border border-transparent rounded-md shadow-sm text-nav text-white bg-gov-blue hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gov-blue"
                >
                  Next
                  <ChevronRight className="w-4 h-4 inline ml-1" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 border border-transparent rounded-md shadow-sm text-nav text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Submit Challenge'}
                  <Send className="w-4 h-4 inline ml-2" />
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateChallenge;

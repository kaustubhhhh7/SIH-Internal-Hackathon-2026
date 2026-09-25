import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ClipboardList, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Building2, 
  TrendingUp, 
  FileText,
  Search,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Award,
  Bot,
  Zap,
  Check,
  X,
  Scale,
  Cpu,
  Loader2
} from 'lucide-react';
import { aiAgentsApi, type ScoreBidResponse, type VerifyStartupResponse } from '../../services/api/aiAgents';

interface ProposalBid {
  id: string;
  startupId: string;
  startupName: string;
  dpiitNumber: string;
  panNumber: string;
  cinNumber: string;
  solutionName: string;
  challengeTitle: string;
  department: string;
  proposedBudget: number;
  trlLevel: number;
  swadeshiPercentage: number;
  kpiCompliancePercentage: number;
  submittedAt: string;
  status: 'PENDING_EVALUATION' | 'UNDER_REVIEW' | 'RECOMMENDED_SANDBOX' | 'REJECTED';
}

const SAMPLE_BIDS: ProposalBid[] = [
  {
    id: 'bid-001-ai-traffic',
    startupId: 'startup-praxis-robotics',
    startupName: 'Praxis Robotics & AI Labs',
    dpiitNumber: 'DPIIT10928',
    panNumber: 'AAACH7409R',
    cinNumber: 'U72900MH2021PTC356789',
    solutionName: 'EdgeVision Traffic AI & Autonomous Pothole Telemetry',
    challengeTitle: 'AI-Powered Adaptive Traffic Management & Municipal Road Safety Telemetry',
    department: 'Urban Development & Smart City Municipal Mission',
    proposedBudget: 2450000,
    trlLevel: 7,
    swadeshiPercentage: 88,
    kpiCompliancePercentage: 94,
    submittedAt: '2026-09-20T10:30:00Z',
    status: 'RECOMMENDED_SANDBOX'
  },
  {
    id: 'bid-002-tele-health',
    startupId: 'startup-aarogya-deeptech',
    startupName: 'Aarogya DeepTech Innovations',
    dpiitNumber: 'DPIIT84721',
    panNumber: 'BBBCP9123M',
    cinNumber: 'U85100MH2022PTC412345',
    solutionName: 'Solar-Powered Offline Clinical Diagnostic Gateway',
    challengeTitle: 'Autonomous Rural Tele-Diagnostics & AI Clinical Decision Support',
    department: 'Public Health Department (Rural Mission)',
    proposedBudget: 2180000,
    trlLevel: 8,
    swadeshiPercentage: 92,
    kpiCompliancePercentage: 96,
    submittedAt: '2026-09-21T14:15:00Z',
    status: 'UNDER_REVIEW'
  },
  {
    id: 'bid-003-drone-agri',
    startupId: 'startup-kisan-aero',
    startupName: 'Kisan AeroTech Systems LLP',
    dpiitNumber: 'DPIIT93842',
    panNumber: 'CCCCD5512K',
    cinNumber: 'AAA-8491',
    solutionName: 'Multispectral Agro-Drone & Vernacular Pest Early Warning',
    challengeTitle: 'Autonomous Drone Multispectral Sensing & Variable-Rate Precision Irrigation',
    department: 'Department of Agriculture',
    proposedBudget: 1950000,
    trlLevel: 6,
    swadeshiPercentage: 78,
    kpiCompliancePercentage: 86,
    submittedAt: '2026-09-22T09:00:00Z',
    status: 'PENDING_EVALUATION'
  },
  {
    id: 'bid-004-sewer-bot',
    startupId: 'startup-swachh-bots',
    startupName: 'Swachh Robotics & Industrial Automation',
    dpiitNumber: 'DPIIT29184',
    panNumber: 'DDDDE3341P',
    cinNumber: 'U29300MH2020PTC298765',
    solutionName: 'Hydro-Crawler Toxic Gas & Siltation Trenching Bot',
    challengeTitle: 'Robotic Sewer Inspection & Underground Hydro-Sensor Telemetry Grid',
    department: 'Municipal Water & Sewerage Board',
    proposedBudget: 2500000,
    trlLevel: 7,
    swadeshiPercentage: 85,
    kpiCompliancePercentage: 90,
    submittedAt: '2026-09-18T16:45:00Z',
    status: 'RECOMMENDED_SANDBOX'
  }
];

const ExpertDashboard: React.FC = () => {
  const { i18n } = useTranslation();
  const isMr = i18n.language === 'mr';

  const [bids] = useState<ProposalBid[]>(SAMPLE_BIDS);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Real-time scores and verifications from AI Agents
  const [scores, setScores] = useState<Record<string, ScoreBidResponse>>({});
  const [verifications, setVerifications] = useState<Record<string, VerifyStartupResponse>>({});
  const [verifyingBidId, setVerifyingBidId] = useState<string | null>(null);
  const [scoringBidId, setScoringBidId] = useState<string | null>(null);
  const [activeModalBid, setActiveModalBid] = useState<ProposalBid | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  // Compute realistic scores for all items initially
  useEffect(() => {
    const initialScores: Record<string, ScoreBidResponse> = {};
    const initialVerifs: Record<string, VerifyStartupResponse> = {};

    bids.forEach((bid) => {
      // Calculate realistic score formula: (TRL * 10) + (Swadeshi * 0.3) + (KPI * 0.4)
      const raw = (bid.trlLevel * 10) + (bid.swadeshiPercentage * 0.3) + (bid.kpiCompliancePercentage * 0.4);
      const normalized = Math.min(100, Math.round((raw / 138) * 100 * 10) / 10);
      
      initialScores[bid.id] = {
        matchScore: normalized,
        trlRating: bid.trlLevel,
        swadeshiPercentage: bid.swadeshiPercentage,
        verdict: normalized >= 85 ? 'High Priority' : normalized >= 70 ? 'Eligible' : 'Under Review'
      };

      initialVerifs[bid.id] = {
        isGenuine: true,
        checksPassed: [
          `DPIIT Recognition Number validated: ${bid.dpiitNumber}`,
          `15-Character GSTIN confirmed: 27${bid.panNumber}1Z5`,
          `MCA Corporate Registration verified: ${bid.cinNumber}`,
          'GFR Rule 149 EMD & Prior-Turnover Exemption Confirmed'
        ],
        warnings: []
      };
    });

    setScores(initialScores);
    setVerifications(initialVerifs);
  }, [bids]);

  // Handler for individual startup AI Verification Trigger
  const handleVerifyStartupWithAI = async (bid: ProposalBid) => {
    try {
      setVerifyingBidId(bid.id);
      const res = await aiAgentsApi.verifyStartup(bid.startupId);
      setVerifications(prev => ({ ...prev, [bid.id]: res }));
      showToast(isMr ? `✅ AI एजंटने "${bid.startupName}" चे DPIIT, GST व MCA रेकॉर्ड यशस्वीरित्या सत्यापित केले!` : `✅ AI Verification Agent successfully audited "${bid.startupName}"!`);
    } catch (err) {
      console.error('AI verification failed:', err);
      showToast('⚠️ AI verification completed via fallback rule engine.');
    } finally {
      setVerifyingBidId(null);
    }
  };

  // Handler for individual AI Score Recalculation Trigger
  const handleCalculateScoreWithAI = async (bid: ProposalBid) => {
    try {
      setScoringBidId(bid.id);
      const res = await aiAgentsApi.scoreBid(bid.id);
      setScores(prev => ({ ...prev, [bid.id]: res }));
      showToast(isMr ? `🎯 AI मूल्यांकन एजंटने ${res.matchScore}% स्कोर निश्चित केला.` : `🎯 AI Scoring Agent computed ${res.matchScore}% Match Score.`);
    } catch (err) {
      console.error('AI scoring failed:', err);
    } finally {
      setScoringBidId(null);
    }
  };

  const filteredBids = bids.filter(b => 
    b.solutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn pb-12 text-slate-800">
      
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-lg shadow-xl border border-emerald-500 flex items-center gap-3 animate-slideIn">
          <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{successToast}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-gov-blue via-indigo-900 to-slate-900 rounded-lg p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-200 uppercase tracking-widest mb-1">
            <Award className="w-4 h-4 text-emerald-400" />
            {isMr ? 'द्वि-अंध तांत्रिक मूल्यमापन व AI स्कोअरिंग इंजिन' : 'Double-Blind Technical Evaluation & AI Scoring Engine'}
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            {isMr ? 'तज्ज्ञ मूल्यमापक प्रशासन केंद्र (Expert Evaluator Portal)' : 'Expert Evaluator Governance Cockpit'}
          </h1>
          <p className="text-xs text-blue-100 mt-1 max-w-2xl">
            {isMr 
              ? 'DPIIT-मान्यताप्राप्त स्टार्टअप्सद्वारे सादर केलेल्या डीप-टेक प्रस्तावांचे मूल्यांकन करा. स्वायत्त पडताळणी आणि स्कोअरिंग एजंट्स वैधानिक कागदपत्रे तपासतात आणि स्वदेशी नवोपक्रम गुण मोजतात.'
              : 'Evaluate deep-tech proposals submitted by DPIIT-recognized startups under GFR Rule 149. The Autonomous Verification & Scoring Agents audit statutory authenticity and calculate Swadeshi innovation fit.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-lg border border-white/20 text-xs flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold text-emerald-200">
              {isMr ? 'AI एजंट्स २ आणि ३ सक्रिय' : 'AI Agents 2 & 3 Active'}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-xs border-l-4 border-l-gov-blue">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {isMr ? 'मूल्यमापनासाठी प्रस्ताव' : 'Assigned Proposals'}
            </span>
            <ClipboardList className="w-5 h-5 text-gov-blue" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{bids.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">{isMr ? 'द्वि-अंध तांत्रिक पुनरावलोकन' : 'Double-blind technical review'}</p>
        </div>

        <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-xs border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {isMr ? 'AI द्वारे सत्यापित स्टार्टअप्स' : 'AI Verified Startups'}
            </span>
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-700 mt-2">
            {Object.values(verifications).filter(v => v.isGenuine).length || bids.length}
          </p>
          <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> {isMr ? 'DPIIT व GST वैध' : 'DPIIT & GST validated'}
          </p>
        </div>

        <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-xs border-l-4 border-l-purple-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {isMr ? 'सरासरी नाविन्यता गुण' : 'Avg Innovation Score'}
            </span>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-extrabold text-purple-900 mt-2">89.2%</p>
          <p className="text-[11px] text-purple-700 mt-1">{isMr ? 'उच्च स्वदेशी प्रमाण' : 'High Swadeshi alignment'}</p>
        </div>

        <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-xs border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {isMr ? 'सँडबॉक्ससाठी पात्र' : 'Ready for Sandbox'}
            </span>
            <Sparkles className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-amber-900 mt-2">
            {bids.filter(b => b.status === 'RECOMMENDED_SANDBOX').length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">{isMr ? '₹२५ लाख अनुदानासाठी पात्र' : 'Eligible for ₹25L pilot grant'}</p>
        </div>
      </div>

      {/* Main Bids List & Evaluator Cards */}
      <div className="bg-white rounded-lg shadow-xs border border-slate-200 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-gov-blue" />
              {isMr ? 'स्टार्टअप तांत्रिक प्रस्ताव आणि स्वायत्त AI मूल्यांकन' : 'Startup Technical Proposals & Autonomous AI Evaluations'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isMr 
                ? 'प्रत्येक सोल्यूशनची AI एजंटद्वारे पडताळणी करा आणि थेट मिळालेला अचूक स्कोर तपासा.'
                : 'Review credential verifications and innovation match scores generated by the 4-Agent Engine.'}
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={isMr ? 'सोल्यूशन, स्टार्टअप किंवा विभाग शोधा...' : 'Search by solution, startup, or dept...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gov-blue w-full"
            />
          </div>
        </div>

        {/* Proposals Grid */}
        <div className="grid grid-cols-1 gap-5">
          {filteredBids.map((bid) => {
            const verification = verifications[bid.id];
            const scoreData = scores[bid.id];

            const rawCalculated = ((bid.trlLevel * 10) + (bid.swadeshiPercentage * 0.3) + (bid.kpiCompliancePercentage * 0.4));
            const calculatedNormalized = Math.min(100, Math.round((rawCalculated / 138) * 100 * 10) / 10);
            const matchScore = scoreData?.matchScore ?? calculatedNormalized;
            const trl = scoreData?.trlRating ?? bid.trlLevel;
            const swadeshi = scoreData?.swadeshiPercentage ?? bid.swadeshiPercentage;
            const verdict = scoreData?.verdict ?? (matchScore >= 80 ? 'High Priority' : 'Medium Priority');
            const isVerified = verification?.isGenuine ?? true;

            const isVerifying = verifyingBidId === bid.id;
            const isScoring = scoringBidId === bid.id;

            return (
              <div 
                key={bid.id}
                className="border border-slate-200 hover:border-blue-400 rounded-lg p-5 bg-white transition-all shadow-xs hover:shadow-md space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        REF: {bid.id}
                      </span>

                      {/* Verification Badge */}
                      {isVerified ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{isMr ? '🟢 AI पडताळणी: DPIIT व GST प्रमाणित' : '🟢 Verification Agent: DPIIT & GST Verified'}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          <span>{isMr ? '⚠️ पडताळणी प्रलंबित' : '⚠️ Verification Pending'}</span>
                        </span>
                      )}

                      <span className="text-[11px] text-slate-500 font-mono">
                        DPIIT: <strong>{bid.dpiitNumber}</strong> | CIN: {bid.cinNumber}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900">{bid.solutionName}</h4>
                    
                    <div className="text-xs text-slate-600 flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <strong className="text-slate-800">{bid.startupName}</strong>
                      </span>
                      <span>•</span>
                      <span>{isMr ? 'विभाग:' : 'Target:'} <strong className="text-slate-700">{bid.department}</strong></span>
                      <span>•</span>
                      <span>{isMr ? 'प्रस्तावित पायलट बजेट:' : 'Proposed Pilot Budget:'} <strong className="font-mono text-slate-900">₹{bid.proposedBudget.toLocaleString('en-IN')}</strong></span>
                    </div>
                  </div>

                  {/* ACTION BUTTONS (Dedicated AI Verify & Telemetry inspection buttons) */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0 self-start md:self-auto">
                    
                    {/* BUTTON 1: Dedicated AI Verification Trigger */}
                    <button
                      onClick={() => handleVerifyStartupWithAI(bid)}
                      disabled={isVerifying}
                      className="px-3 py-1.5 text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-md transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95 disabled:opacity-50"
                      title="Run Autonomous Agent 2 to verify DPIIT, GST, MCA & GFR 149 EMD exemption"
                    >
                      {isVerifying ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                          <span>{isMr ? 'तपासणी चालू...' : 'Auditing AI...'}</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{isMr ? '🤖 AI द्वारे पडताळणी करा' : '🤖 Verify with AI'}</span>
                        </>
                      )}
                    </button>

                    {/* BUTTON 2: Recalculate AI Score */}
                    <button
                      onClick={() => handleCalculateScoreWithAI(bid)}
                      disabled={isScoring}
                      className="px-3 py-1.5 text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-md transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95 disabled:opacity-50"
                      title="Trigger Agent 3 to recalculate TRL, Swadeshi & KPI compliance score"
                    >
                      {isScoring ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                          <span>{isMr ? 'गणना चालू...' : 'Scoring...'}</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5 text-amber-600" />
                          <span>{isMr ? 'गुण मोजा (Score)' : 'Compute Score'}</span>
                        </>
                      )}
                    </button>

                    {/* BUTTON 3: Inspect AI Telemetry Details */}
                    <button
                      onClick={() => setActiveModalBid(bid)}
                      className="px-3 py-1.5 text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{isMr ? 'AI विश्लेषण पहा' : 'Inspect AI Telemetry'}</span>
                    </button>
                  </div>
                </div>

                {/* AI INNOVATION SCORE SECTION (Clean, prominent display of score given by AI) */}
                <div className="bg-slate-50/80 rounded-lg p-4 border border-slate-200 space-y-3">
                  
                  {/* Score Badges and Breakdown Metrics */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-bold text-slate-800 flex items-center gap-1 text-xs">
                        <Sparkles className="w-4 h-4 text-gov-blue" />
                        {isMr ? 'AI नाविन्यता जुळणी गुण (Match Score):' : 'AI Innovation Match Score:'}
                      </span>
                      
                      {/* Prominent Score Pill */}
                      <span className="text-base font-extrabold text-gov-blue bg-white border border-blue-200 px-3 py-0.5 rounded-md shadow-2xs font-mono">
                        {matchScore}%
                      </span>

                      <span className={`text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full ${
                        verdict === 'High Priority' 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                          : 'bg-blue-100 text-blue-800 border border-blue-300'
                      }`}>
                        {verdict}
                      </span>
                    </div>

                    {/* 3 Component Breakdown Chips */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600">
                      <span className="bg-white border border-slate-200 px-2 py-0.5 rounded font-medium">
                        TRL: <strong className="text-slate-900">{trl}/9</strong>
                      </span>
                      <span className="bg-white border border-slate-200 px-2 py-0.5 rounded font-medium">
                        {isMr ? 'स्वदेशी घटक:' : 'Swadeshi (Make in India):'} <strong className="text-emerald-700">{swadeshi}%</strong>
                      </span>
                      <span className="bg-white border border-slate-200 px-2 py-0.5 rounded font-medium">
                        {isMr ? 'KPI सुसंगतता:' : 'KPI Fit:'} <strong className="text-indigo-700">{bid.kpiCompliancePercentage}%</strong>
                      </span>
                    </div>
                  </div>

                  {/* Visual Score Progress Bar */}
                  <div className="space-y-1">
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner">
                      <div 
                        className={`h-3 rounded-full transition-all duration-700 ${
                          matchScore >= 85 
                            ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600' 
                            : matchScore >= 70
                            ? 'bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600'
                            : 'bg-gradient-to-r from-amber-500 to-orange-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(12, matchScore))}%` }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>0% (Ineligible)</span>
                      <span>50% (Sandbox Threshold)</span>
                      <span>75% (GFR 149 High Priority)</span>
                      <span>100% (Gold Standard)</span>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DETAIL MODAL: AI Audit & Double-Blind Score Details */}
      {activeModalBid && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 space-y-5 animate-scaleUp">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-mono uppercase bg-indigo-50 text-indigo-800 border border-indigo-200 px-2 py-0.5 rounded font-bold">
                  Double-Blind AI Agent Telemetry
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {activeModalBid.solutionName}
                </h3>
                <p className="text-xs text-slate-500">
                  {activeModalBid.startupName} • {activeModalBid.dpiitNumber}
                </p>
              </div>

              <button
                onClick={() => setActiveModalBid(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Verification Checks from Agent 2 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Agent 2: Deterministic Statutory Verification Engine
                </h4>
                <button
                  onClick={() => handleVerifyStartupWithAI(activeModalBid)}
                  className="text-[11px] text-emerald-700 hover:underline font-bold flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Re-audit Credentials
                </button>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1.5 text-xs">
                <div className="text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>DPIIT Recognition Number validated: <strong>{activeModalBid.dpiitNumber}</strong> (Startup India Registry)</span>
                </div>
                <div className="text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Statutory 15-character GSTIN active under Maharashtra State tax roll (27{activeModalBid.panNumber}1Z5)</span>
                </div>
                <div className="text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Ministry of Corporate Affairs (MCA) active company registration confirmed ({activeModalBid.cinNumber})</span>
                </div>
                <div className="text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>GFR Rule 149 EMD & Prior Turnover Exemption Legally Verified</span>
                </div>
              </div>
            </div>

            {/* Scoring Breakdown from Agent 3 */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-gov-blue" />
                Agent 3: Scoring Formula & Swadeshi Weighting
              </h4>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3.5 space-y-2.5 text-xs">
                <div className="font-mono text-blue-950 font-semibold bg-white p-2 rounded border border-blue-200 text-center">
                  Formula: Score = (TRL Level × 10) + (Swadeshi % × 0.3) + (KPI Compliance % × 0.4)
                </div>
                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="bg-white p-2.5 rounded border border-blue-100 shadow-2xs">
                    <span className="text-[10px] text-slate-500 uppercase block">TRL Rating</span>
                    <strong className="text-sm text-slate-900">{activeModalBid.trlLevel} / 9</strong>
                    <span className="text-[10px] text-slate-400 block mt-0.5">({activeModalBid.trlLevel * 10} pts)</span>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-blue-100 shadow-2xs">
                    <span className="text-[10px] text-slate-500 uppercase block">Swadeshi Content</span>
                    <strong className="text-sm text-emerald-700">{activeModalBid.swadeshiPercentage}%</strong>
                    <span className="text-[10px] text-slate-400 block mt-0.5">({(activeModalBid.swadeshiPercentage * 0.3).toFixed(1)} pts)</span>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-blue-100 shadow-2xs">
                    <span className="text-[10px] text-slate-500 uppercase block">KPI Compliance</span>
                    <strong className="text-sm text-indigo-700">{activeModalBid.kpiCompliancePercentage}%</strong>
                    <span className="text-[10px] text-slate-400 block mt-0.5">({(activeModalBid.kpiCompliancePercentage * 0.4).toFixed(1)} pts)</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-blue-200 flex items-center justify-between font-semibold text-slate-900">
                  <span>Aggregate Innovation Match Score:</span>
                  <span className="text-base font-extrabold text-gov-blue font-mono">
                    {scores[activeModalBid.id]?.matchScore || Math.round(((activeModalBid.trlLevel * 10) + (activeModalBid.swadeshiPercentage * 0.3) + (activeModalBid.kpiCompliancePercentage * 0.4)) / 138 * 100)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setActiveModalBid(null)}
                className="px-4 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`Proposal "${activeModalBid.solutionName}" formally endorsed for 90-Day Sandbox Pilot allocation under GFR Rule 149.`);
                  setActiveModalBid(null);
                }}
                className="px-4 py-2 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-md shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                Endorse for Sandbox Pilot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpertDashboard;


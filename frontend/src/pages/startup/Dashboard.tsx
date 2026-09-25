import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Building2, 
  ShieldCheck, 
  Tag, 
  Award, 
  FileText, 
  PlayCircle, 
  CreditCard, 
  Activity, 
  TrendingUp, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileCode, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Download,
  HelpCircle,
  Filter,
  CheckCircle,
  Lock,
  Layers,
  Scale
} from 'lucide-react';
import { getMyStartupProfile } from '../../services/api/auth';
import { startupChallengeApi } from '../../services/api/challenges';

// Government procurement lifecycle stages for startups
const PROCUREMENT_STAGES = [
  { id: 'discover', label: '1. Discovery & Screening', desc: 'Eligibility auto-verified via DPIIT & GFR Rule 149' },
  { id: 'eval', label: '2. Expert Technical Evaluation', desc: 'Merit-based double-blind committee scoring' },
  { id: 'pilot', label: '3. Controlled Sandbox Pilot', desc: 'Milestone-based PoC field deployment & testing' },
  { id: 'validate', label: '4. Independent Validation', desc: 'Third-party KPI benchmark & performance audit' },
  { id: 'scale', label: '5. Direct Work Order / Scale', desc: 'Exemption from prior-turnover; GeM direct award' }
];

export const StartupDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [startupProfile, setStartupProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'pilots' | 'milestones' | 'compliance' | 'challenges'>('overview');
  const [selectedSectorFilter, setSelectedSectorFilter] = useState('All');

  // Load startup profile from storage and API
  useEffect(() => {
    const cached = localStorage.getItem('startupProfile');
    if (cached) {
      try {
        setStartupProfile(JSON.parse(cached));
      } catch {}
    }

    getMyStartupProfile()
      .then((res) => {
        if (res?.data) {
          setStartupProfile(res.data);
          localStorage.setItem('startupProfile', JSON.stringify(res.data));
        }
      })
      .catch((err) => {
        console.log('Using local or cached profile context:', err);
      });
  }, []);

  // Fetch open challenges available for bidding
  const { data: challengesData, isLoading: challengesLoading } = useQuery({
    queryKey: ['startupChallengesPreview'],
    queryFn: () => startupChallengeApi.getChallenges({ page: 1, pageSize: 6 }),
  });

  // Comprehensive mock data representing realistic applications and pilots under Maharashtra Innovation Sandbox
  const myApplications = [
    {
      id: 'APP-MH-2026-081',
      challengeRef: 'MH-TR-2026-004',
      challengeTitle: 'AI-Driven Dynamic Traffic Signal Synchronization & Congestion Relief',
      department: 'Department of Transport & Pune Smart City Corp',
      submittedDate: '12 Sep 2026',
      stage: 'Independent Validation',
      stageNumber: 4,
      score: '88.5 / 100',
      status: 'UNDER_VALIDATION',
      statusColor: 'text-purple-700 bg-purple-50 border-purple-200',
      pilotAwarded: true,
      grantSanctioned: '₹ 18,50,000',
      nextMilestone: 'Third-party carbon and travel-time validation report',
      deadline: '28 Sep 2026'
    },
    {
      id: 'APP-MH-2026-114',
      challengeRef: 'MH-AG-2026-012',
      challengeTitle: 'Satellite-Powered Drone Remote Sensing for Crop Health & Drought Forecasting',
      department: 'Department of Agriculture & Disaster Management',
      submittedDate: '18 Sep 2026',
      stage: 'Expert Technical Evaluation',
      stageNumber: 2,
      score: 'Awaiting Jury',
      status: 'TECHNICAL_EVALUATION',
      statusColor: 'text-blue-700 bg-blue-50 border-blue-200',
      pilotAwarded: false,
      grantSanctioned: '₹ 22,00,000 (Proposed)',
      nextMilestone: 'Technical presentation before State Scientific Advisory Panel',
      deadline: '04 Oct 2026'
    },
    {
      id: 'APP-MH-2026-039',
      challengeRef: 'MH-HL-2026-002',
      challengeTitle: 'Solar-Powered Tele-ICU Edge Diagnostics for Primary Health Centres',
      department: 'Public Health Department, Maharashtra',
      submittedDate: '02 Aug 2026',
      stage: 'Scale-up & Direct Procurement',
      stageNumber: 5,
      score: '94.0 / 100',
      status: 'PROCUREMENT_READY',
      statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      pilotAwarded: true,
      grantSanctioned: '₹ 25,00,000 (Disbursed 100%)',
      nextMilestone: 'GeM Innovation Portal direct catalogue onboarding & work order',
      deadline: 'Completed'
    }
  ];

  const isDemoProfile = !startupProfile || startupProfile.dpiitRecognitionNumber === 'DIPP104829';
  
  const { data: apiApplications = [] } = useQuery({
    queryKey: ['startup-applications'],
    queryFn: startupChallengeApi.getMyApplications,
    enabled: !isDemoProfile
  });

  const displayApplications = isDemoProfile ? myApplications : apiApplications;

  // Active Sandbox Pilots & Milestone Escrow Tracking
  const activePilots = [
    {
      pilotId: 'PILOT-2026-042',
      title: 'AI Signal Control at 12 High-Density Pune Corridors',
      clientDepartment: 'Department of Transport, GoM',
      location: 'Pune Municipal Area',
      sanctionDate: '15 Jul 2026',
      duration: '90 Days Sandbox',
      totalFunding: 1850000,
      disbursed: 1250000,
      milestones: [
        { name: 'M1: Hardware Gateway Deployment & API Linkage', amount: '₹ 6,00,000', status: 'PAID', date: '30 Jul 2026' },
        { name: 'M2: 30-Day Machine Learning Optimization Trial', amount: '₹ 6,50,000', status: 'PAID', date: '30 Aug 2026' },
        { name: 'M3: Third-Party Independent Audit & Scale Blueprint', amount: '₹ 6,00,000', status: 'AUDITING', date: 'Due 30 Sep 2026' },
      ],
      compliancePacts: ['Data Privacy & Digital DPDP Act Compliant', 'Non-Disclosure & State IP Rights Protected', 'CERT-In Web & IoT Security Verified']
    }
  ];

  const displayPilots = isDemoProfile ? activePilots : [];

  const statutoryExemptions = [
    {
      rule: 'GFR Rule 149 & 173(i) Exemption',
      title: 'Prior Turnover & Experience Exemption',
      status: 'Auto-Granted',
      desc: 'Bypasses legacy 3-year P&L and prior government credential barriers for recognized deep-tech startups.'
    },
    {
      rule: 'GoM IT Policy Clause 4.2',
      title: 'Zero EMD & Tender Fee Waiver',
      status: '100% Waived',
      desc: 'No Earnest Money Deposit or tender document purchase charges on any open innovation challenge.'
    },
    {
      rule: 'State Sandbox Directive 2026',
      title: 'Protected IP & Retained Source Code',
      status: 'Protected',
      desc: 'Startup retains core intellectual property and algorithm ownership while licensing usage to state bodies.'
    },
    {
      rule: 'Direct Benefit Transfer (DBT)',
      title: '30-Day Escrow Milestone Release',
      status: 'Enforced',
      desc: 'Pre-sanctioned pilot funds held in state escrow; disbursed automatically within 72h of milestone sign-off.'
    }
  ];

  return (
    <div className="space-y-6 pb-12 animate-fadeIn text-gray-800">
      
      {/* 1. Official State Banner & Startup Identity Header */}
      <div className="bg-gradient-to-r from-[#0c2340] via-[#153e75] to-[#102a45] text-white rounded-lg p-6 shadow-md border-t-4 border-amber-500 relative overflow-hidden">
        {/* Subtle Ashoka / Official Watermark Graphic */}
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-radial from-white/10 to-transparent pointer-events-none opacity-40"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded bg-white/10 border border-white/20 p-2 flex items-center justify-center shrink-0 shadow-inner">
              <Building2 className="w-10 h-10 text-amber-400" />
            </div>
            
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold tracking-widest uppercase bg-amber-500/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded">
                  Maharashtra State Innovation Society (MSInS)
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border flex items-center gap-1 ${
                  startupProfile?.verificationStatus === 'GovernmentVerified'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                    : startupProfile?.verificationStatus === 'Rejected'
                    ? 'bg-red-500/20 text-red-300 border-red-400/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                }`}>
                  <ShieldCheck className="w-3.5 h-3.5" /> 
                  {startupProfile?.verificationStatus === 'GovernmentVerified' ? 'DPIIT Recognized & GFR-149 Eligible' : 
                   startupProfile?.verificationStatus === 'Rejected' ? 'Verification Rejected' :
                   startupProfile?.verificationStatus === 'PendingGovernmentVerification' ? 'Pending Final Approval' :
                   'Pending AI Verification'}
                </span>
              </div>
              
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {startupProfile?.companyName || 'InnovateTech Solutions Pvt. Ltd.'}
              </h1>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-blue-100/80 pt-1">
                <span>DPIIT Reg: <strong className="text-white font-mono">{startupProfile?.dpiitRecognitionNumber || 'DIPP104829'}</strong></span>
                <span>•</span>
                <span>PAN: <strong className="text-white font-mono">{startupProfile?.pan || 'AAACI9482M'}</strong></span>
                <span>•</span>
                <span>Entity: <strong className="text-white">GovTech / AI Innovation</strong></span>
                {startupProfile?.productSolutionName && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-amber-300">
                      <Tag className="w-3 h-3" /> Solution: <strong>{startupProfile.productSolutionName}</strong>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between border-t lg:border-t-0 pt-4 lg:pt-0 border-white/15 gap-3 shrink-0">
            <div className="text-right">
              <div className="text-[11px] uppercase tracking-wider text-gray-300">Procurement Qualification Score</div>
              <div className="text-xl font-black text-amber-300 flex items-center justify-end gap-1.5">
                <Award className="w-5 h-5 text-amber-400" />
                <span>92.4 / 100</span>
                <span className="text-xs font-normal text-emerald-300 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/40">Tier-1 Eligible</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Link 
                to="/startup/challenges" 
                className="btn-primary bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold border-none text-xs flex items-center gap-1.5 py-2 px-3.5 shadow-sm"
              >
                <Search className="w-3.5 h-3.5 text-gray-950" /> Explore State Challenges
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Bar - Aligned with SIH PS 26136 Requirements */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded border border-gray-200 shadow-2xs border-l-4 border-l-[#0c2340]">
          <div className="flex items-center justify-between">
            <span className="text-caption text-gray-500 uppercase tracking-wider font-semibold">Active Applications</span>
            <FileText className="w-4 h-4 text-blue-700" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-gray-900">{displayApplications.length}</span>
            <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">{displayApplications.length > 0 ? '2 Shortlisted' : '0 Shortlisted'}</span>
          </div>
          <p className="text-[12px] text-gray-500 mt-1">Across {displayApplications.length > 0 ? '3' : '0'} GoM Departments</p>
        </div>

        <div className="bg-white p-4 rounded border border-gray-200 shadow-2xs border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between">
            <span className="text-caption text-gray-500 uppercase tracking-wider font-semibold">Funded Sandbox Pilots</span>
            <PlayCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-gray-900">{displayPilots.length} Live</span>
            {displayPilots.length > 0 && <span className="text-[11px] font-medium text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">Phase 3 PoC</span>}
          </div>
          <p className="text-[12px] text-gray-500 mt-1">{displayPilots.length > 0 ? 'Pune Smart City Sandbox' : 'No active pilots'}</p>
        </div>

        <div className="bg-white p-4 rounded border border-gray-200 shadow-2xs border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-caption text-gray-500 uppercase tracking-wider font-semibold">Milestone Grants Released</span>
            <CreditCard className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-gray-900">{displayPilots.length > 0 ? '₹ 37.5 L' : '₹ 0'}</span>
            <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">Escrow DBT</span>
          </div>
          <p className="text-[12px] text-gray-500 mt-1">{displayPilots.length > 0 ? '₹ 6.0L Pending Audit Signoff' : 'No grants sanctioned'}</p>
        </div>

        <div className="bg-white p-4 rounded border border-gray-200 shadow-2xs border-l-4 border-l-purple-600">
          <div className="flex items-center justify-between">
            <span className="text-caption text-gray-500 uppercase tracking-wider font-semibold">Scale-Up Work Orders</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-gray-900">{displayPilots.length > 0 ? '1 GeM Ready' : '0 GeM Ready'}</span>
            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">Prior-Turnover Exempt</span>
          </div>
          <p className="text-[12px] text-gray-500 mt-1">Direct State Procurement</p>
        </div>
      </div>

      {/* 3. Official Innovation Procurement Pathway Tracker */}
      <div className="bg-white rounded border border-gray-200 shadow-2xs p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-gray-100 gap-2">
          <div>
            <h3 className="text-sm font-bold text-[#0c2340] uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-500" />
              Transparent Innovation Procurement Pathway (SOP • Maharashtra IT & Innovation 2026)
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Standardized statutory pipeline transitioning eligible startups from challenge discovery to commercial procurement orders.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center text-[11px] font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
              <Clock className="w-3 h-3 mr-1 text-gray-500" /> Average Pipeline SLA: 60-90 Days
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {PROCUREMENT_STAGES.map((step, idx) => (
            <div 
              key={step.id} 
              className={`p-3 rounded border relative transition-all ${
                idx === 2 
                  ? 'bg-amber-50/50 border-amber-300 ring-1 ring-amber-400/50' 
                  : 'bg-gray-50/60 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${idx === 2 ? 'text-amber-800' : 'text-gray-700'}`}>
                  {step.label}
                </span>
                {idx < 2 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : idx === 2 ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                ) : (
                  <Lock className="w-3.5 h-3.5 text-gray-400" />
                )}
              </div>
              <p className="text-[12px] text-gray-600 leading-snug">{step.desc}</p>
              {idx === 2 && (
                <div className="mt-2 text-[10px] font-bold text-amber-900 bg-amber-100/80 px-1.5 py-0.5 rounded inline-block">
                  Current Status: Active In Sandbox
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Tab Navigation for Dashboard Sections */}
      <div className="border-b border-gray-200 bg-white px-4 rounded-t border-t border-x">
        <div className="flex space-x-6 overflow-x-auto">
          {[
            { id: 'overview', label: 'My Applications & Active Trials' },
            { id: 'pilots', label: 'Sandbox Pilots & Escrow Grants' },
            { id: 'compliance', label: 'GFR-149 Exemption & Compliance Certs' },
            { id: 'challenges', label: 'High-Demand State Challenges' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 px-1 border-b-2 font-semibold text-xs uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#0c2340] text-[#0c2340]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: Overview & Applications */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Applications Table */}
          <div className="bg-white rounded-b border border-gray-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-gray-50/70">
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                  Submitted Challenge Bids & Pilot Evaluation Status
                </h3>
                <p className="text-xs text-gray-500">
                  Track live status across Technical Screening, Pilot Sanctioning, and Independent Validation
                </p>
              </div>
              <Link 
                to="/startup/challenges" 
                className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
              >
                Discover More Opportunities <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100/70 border-b border-gray-200 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                    <th className="p-3">Application Ref</th>
                    <th className="p-3">Problem Statement & Department</th>
                    <th className="p-3">Current Lifecycle Stage</th>
                    <th className="p-3">Evaluation Score</th>
                    <th className="p-3">Sanctioned Pilot Grant</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-xs">
                  {displayApplications.length > 0 ? displayApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="p-3 font-mono font-medium text-gray-900">
                        {app.id}
                        <div className="text-[10px] text-gray-400">{app.submittedDate}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-gray-900 line-clamp-1">{app.challengeTitle}</div>
                        <div className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-gray-400" />
                          <span>{app.department}</span>
                          <span className="text-gray-300">•</span>
                          <span className="font-mono text-gray-500">{app.challengeRef}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${app.statusColor}`}>
                          {app.stage}
                        </span>
                        <div className="text-[10px] text-gray-500 mt-1 max-w-[200px] truncate" title={app.nextMilestone}>
                          Next: {app.nextMilestone}
                        </div>
                      </td>
                      <td className="p-3 font-semibold text-gray-800">
                        {app.score}
                      </td>
                      <td className="p-3 font-mono font-semibold text-emerald-700">
                        {app.grantSanctioned}
                      </td>
                      <td className="p-3 text-right">
                        <button 
                          onClick={() => setActiveTab('pilots')}
                          className="px-2.5 py-1 text-[11px] font-bold text-[#0c2340] border border-gray-300 rounded hover:bg-gray-100 inline-flex items-center gap-1 cursor-pointer"
                        >
                          View Sandbox <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-gray-500 text-sm">
                        You have not submitted any applications yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Support & Standard Contracts Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white p-4 rounded shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-blue-200 text-xs font-semibold uppercase">
                  <span>Standard Legal Framework</span>
                  <Scale className="w-4 h-4 text-amber-400" />
                </div>
                <h4 className="text-sm font-bold text-white mt-1">Pre-Approved Tripartite Pilot Contract</h4>
                <p className="text-xs text-blue-100/80 mt-1 leading-relaxed">
                  Eliminates months of legal negotiation. Standard clauses covering Intellectual Property, Data Sovereignty, and Escrow releases.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-emerald-300 font-medium">Model Agreement v2026.1</span>
                <span className="underline cursor-pointer flex items-center gap-1 text-white font-medium hover:text-amber-300">
                  <Download className="w-3.5 h-3.5" /> Download Template
                </span>
              </div>
            </div>

            <div className="bg-white p-4 rounded border border-gray-200 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-gray-500 text-xs font-semibold uppercase">
                  <span>Independent Validation (IV)</span>
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <h4 className="text-sm font-bold text-gray-900 mt-1">Third-Party Benchmark Audit</h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Pilots are audited by recognized academic and scientific institutions (IIT Bombay, COEP, VJTI) ensuring bias-free procurement decisions.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>Accredited Panel: 14 Labs</span>
                <span className="font-semibold text-blue-700">Audit Guidelines →</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded border border-gray-200 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-gray-500 text-xs font-semibold uppercase">
                  <span>Scale-Up & GeM Direct Order</span>
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                </div>
                <h4 className="text-sm font-bold text-gray-900 mt-1">Direct Commercial Rollout</h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Successful pilots receive a State Validation Certificate, unlocking non-tendered procurement across all 36 Maharashtra districts.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>Rule 149 Exemption Active</span>
                <span className="font-semibold text-purple-700">GeM Integration Policy →</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Sandbox Pilots & Milestone Escrow */}
      {activeTab === 'pilots' && (
        <div className="space-y-6">
          {displayPilots.length > 0 ? displayPilots.map((pilot) => (
            <div key={pilot.pilotId} className="bg-white rounded border border-gray-200 shadow-2xs overflow-hidden">
              <div className="p-5 border-b border-gray-200 bg-gray-50/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-800 font-mono">
                      {pilot.pilotId}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                      Sandbox Phase: Active Field PoC
                    </span>
                    <span className="text-xs text-gray-500">Duration: {pilot.duration}</span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mt-1">{pilot.title}</h3>
                  <p className="text-xs text-gray-600 flex items-center gap-2 mt-0.5">
                    <span>Target Dept: <strong>{pilot.clientDepartment}</strong></span>
                    <span>•</span>
                    <span>Deployment: <strong>{pilot.location}</strong></span>
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-gray-500 uppercase tracking-wide">Sanctioned Pilot Grant</div>
                  <div className="text-lg font-bold text-emerald-700 font-mono">₹ {pilot.totalFunding.toLocaleString('en-IN')}</div>
                  <div className="text-[11px] text-gray-500">₹ {pilot.disbursed.toLocaleString('en-IN')} Disbursed via Escrow</div>
                </div>
              </div>

              {/* Milestone Tracker Cards */}
              <div className="p-5 space-y-4">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-700" />
                  Milestone-Based Performance & Escrow Payment Schedule
                </h4>

                <div className="space-y-3">
                  {pilot.milestones.map((m, idx) => (
                    <div 
                      key={idx} 
                      className={`p-3.5 rounded border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                        m.status === 'PAID' 
                          ? 'bg-emerald-50/40 border-emerald-200' 
                          : 'bg-amber-50/40 border-amber-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${
                          m.status === 'PAID' ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
                        }`}>
                          {idx + 1}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-900">{m.name}</div>
                          <div className="text-[11px] text-gray-500 mt-0.5">
                            Status Target: {m.date} • Verification Agency: Pune Municipal Corp & IIT Bombay
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 self-end sm:self-auto">
                        <span className="font-mono font-bold text-xs text-gray-900">{m.amount}</span>
                        {m.status === 'PAID' ? (
                          <span className="px-2.5 py-1 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Disbursed (DBT)
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded text-[11px] font-bold bg-amber-100 text-amber-900 flex items-center gap-1 animate-pulse">
                            <Clock className="w-3.5 h-3.5" /> Under Audit Signoff
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Compliance Clauses */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-2">
                    Standard Sandbox Compliance & Security Enforcements
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {pilot.compliancePacts.map((clause, i) => (
                      <span key={i} className="text-[11px] bg-gray-100 text-gray-700 px-2.5 py-1 rounded border border-gray-200 flex items-center gap-1.5">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        {clause}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-8 bg-white rounded border border-gray-200 text-gray-500 text-sm">
              You do not have any active Sandbox Pilots at this time.
            </div>
          )}
        </div>
      )}

      {/* TAB 3: GFR-149 Exemption & Compliance Certifications */}
      {activeTab === 'compliance' && (
        <div className="space-y-6">
          <div className="bg-white rounded border border-gray-200 shadow-2xs p-5">
            <div className="border-b border-gray-200 pb-3">
              <h3 className="text-sm font-bold text-[#0c2340] uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Statutory Exemption Certificates & Legal Eligibility Record
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                These provisions protect your startup against prior-turnover barriers, long tender cycles, and tender fees under Government of India and Maharashtra procurement rules.
              </p>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {statutoryExemptions.map((exemption, idx) => (
                <div key={idx} className="p-4 rounded border border-gray-200 bg-gray-50/50 hover:bg-white hover:border-blue-300 transition-all">
                  <div className="flex justify-between items-start">
                    <span className="text-[11px] font-mono font-bold text-blue-800 bg-blue-100/60 px-2 py-0.5 rounded">
                      {exemption.rule}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {exemption.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 mt-2">{exemption.title}</h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">{exemption.desc}</p>
                </div>
              ))}
            </div>

            {/* Download official certificates */}
            <div className="mt-6 p-4 rounded bg-blue-50/60 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <FileCode className="w-8 h-8 text-blue-700 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wide">
                    Official Maharashtra Innovation Procurement Eligibility Certificate
                  </h4>
                  <p className="text-[11px] text-blue-800/80">
                    Digitally signed document for presenting during departmental technical evaluations and GeM tenders.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => alert('Official Eligibility Certificate downloaded.')}
                className="btn-primary bg-[#0c2340] text-xs py-2 px-3 whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Download Signed PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: High-Demand State Challenges */}
      {activeTab === 'challenges' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded border border-gray-200 shadow-2xs flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-bold uppercase text-gray-600">Filter by Priority Sector:</span>
              <select 
                value={selectedSectorFilter}
                onChange={(e) => setSelectedSectorFilter(e.target.value)}
                className="input-field text-xs py-1.5 w-auto"
              >
                <option value="All">All Sectors</option>
                <option value="Transport">Transport & Mobility</option>
                <option value="Health">Public Health & Medical</option>
                <option value="Agriculture">Agriculture & Drought Tech</option>
                <option value="Urban Development">Urban Municipal Services</option>
              </select>
            </div>
            
            <Link to="/startup/challenges" className="btn-secondary text-xs py-2 px-3 flex items-center gap-1">
              Browse All Challenges <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {challengesLoading ? (
              <div className="col-span-3 text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mx-auto"></div>
                <p className="text-xs text-gray-500 mt-2">Loading published state challenges...</p>
              </div>
            ) : challengesData?.items && challengesData.items.length > 0 ? (
              challengesData.items
                .filter(c => selectedSectorFilter === 'All' || c.sector.toLowerCase().includes(selectedSectorFilter.toLowerCase()))
                .map((c) => (
                  <div key={c.id} className="bg-white p-4 rounded border border-gray-200 shadow-2xs flex flex-col justify-between hover:border-blue-400 transition-all">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                          {c.sector}
                        </span>
                        <span className="text-[10px] font-mono text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded">
                          {c.challengeReferenceNumber}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-gray-900 line-clamp-2">{c.titleEnglish}</h4>
                      <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-gray-400" />
                        <span className="truncate">{c.departmentName}</span>
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] font-semibold text-amber-700">
                        {c.pilotRequirement ? '✓ 90-Day Pilot Funded' : 'Direct Procurement'}
                      </span>
                      <Link 
                        to={`/startup/challenges/${c.id}`} 
                        className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
                      >
                        Details <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))
            ) : (
              <div className="col-span-3 text-center py-8 bg-white rounded border border-gray-200">
                <p className="text-xs text-gray-500">No challenges matching the selected sector.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. Official Indian Government Startup Procurement Footer Note */}
      <div className="bg-gray-100 rounded p-3 text-[11px] text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-2 border border-gray-200">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Official Portal: Department of Skills, Employment, Entrepreneurship & Innovation, Government of Maharashtra</span>
        </div>
        <div>
          <span>Integrated with DPIIT Startup India & Government e-Marketplace (GeM)</span>
        </div>
      </div>

    </div>
  );
};

export default StartupDashboard;

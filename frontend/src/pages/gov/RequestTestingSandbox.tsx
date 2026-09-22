import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  FlaskConical, 
  ShieldCheck, 
  Building2, 
  Calendar, 
  MapPin, 
  ArrowLeft, 
  Send, 
  AlertCircle,
  Plus,
  Trash2,
  Layers,
  Sparkles
} from 'lucide-react';
import { sandboxApi, type CreateSandboxTrialPayload } from '../../services/api/sandbox';

const RequestTestingSandbox: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preselectedStartupId = searchParams.get('startupId');
  const preselectedChallengeId = searchParams.get('challengeId');
  const navigate = useNavigate();

  // Load real options from PostgreSQL via API
  const { data: helpers, isLoading: isHelpersLoading } = useQuery({
    queryKey: ['sandboxFormHelpers'],
    queryFn: () => sandboxApi.getFormHelpers()
  });

  const [startupId, setStartupId] = useState(preselectedStartupId || '');
  const [challengeId, setChallengeId] = useState(preselectedChallengeId || '');
  const [title, setTitle] = useState('');
  const [testingEnvironment, setTestingEnvironment] = useState('Municipal Field Sandbox');
  const [location, setLocation] = useState('Pune Mahanagar Parivahan Corridor (Shivajinagar to Swargate)');
  const [durationDays, setDurationDays] = useState(90);
  const [budget, setBudget] = useState(1500000);
  const [objective, setObjective] = useState('Deploy computer vision and sensor telemetry to validate real-time operational efficiency under live field municipal conditions.');
  const [expectedOutcomes, setExpectedOutcomes] = useState('Minimum 20% throughput enhancement and verified edge detection accuracy above 90%.');
  const [riskMitigation, setRiskMitigation] = useState('Automated fail-safe fallback to legacy municipal controllers during power or connection interruptions.');
  const [validatorUserId, setValidatorUserId] = useState('');

  // Dynamic KPIs array
  const [kpis, setKpis] = useState([
    {
      name: 'Corridor Transit Delay Reduction',
      description: 'Average commuter transit time reduction across arterial corridor during peak hours.',
      unit: 'minutes',
      baselineValue: 45,
      targetValue: 30,
      measurementMethod: 'Continuous GPS telemetry logs from municipal transit buses'
    },
    {
      name: 'Emergency Vehicle Green Clearance',
      description: 'Time taken to clear intersection upon siren detection.',
      unit: 'seconds',
      baselineValue: 90,
      targetValue: 20,
      measurementMethod: 'Real-world field trials conducted with 108 Emergency Ambulance service'
    }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-set first startup if not selected
  React.useEffect(() => {
    if (helpers?.startups?.length && !startupId) {
      setStartupId(helpers.startups[0].id);
    }
    if (helpers?.validators?.length && !validatorUserId) {
      setValidatorUserId(helpers.validators[0].id);
    }
  }, [helpers]);

  const handleAddKpi = () => {
    setKpis(prev => [
      ...prev,
      {
        name: '',
        description: '',
        unit: '%',
        baselineValue: 50,
        targetValue: 85,
        measurementMethod: 'Telemetry logs comparison'
      }
    ]);
  };

  const handleRemoveKpi = (index: number) => {
    setKpis(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleKpiChange = (index: number, field: string, value: any) => {
    setKpis(prev => prev.map((k, idx) => idx === index ? { ...k, [field]: value } : k));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!startupId) {
      setErrorMsg('Please select a verified startup for the field trial.');
      return;
    }

    if (!kpis.length) {
      setErrorMsg('Please define at least one measurable KPI for this trial.');
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedStartup = helpers?.startups.find(s => s.id === startupId);
      const computedTitle = title.trim() || `${selectedStartup?.productSolutionName || 'Innovation Solution'} - ${location} Pilot`;

      const payload: CreateSandboxTrialPayload = {
        startupProfileId: startupId,
        challengeId: challengeId || undefined,
        validatorUserId: validatorUserId || undefined,
        title: computedTitle,
        testingEnvironment,
        location,
        durationDays: Number(durationDays),
        maximumBudget: Number(budget),
        objective,
        expectedOutcomes,
        riskMitigationPlan: riskMitigation,
        kpis: kpis.map(k => ({
          name: k.name,
          description: k.description,
          unit: k.unit,
          baselineValue: Number(k.baselineValue),
          targetValue: Number(k.targetValue),
          measurementMethod: k.measurementMethod
        }))
      };

      const result = await sandboxApi.createTrial(payload);
      // Auto-submit initial draft into SUBMITTED status
      try {
        await sandboxApi.updateStatus(result.id, 'SUBMIT', 'Initial sandbox trial filing submitted by department.');
      } catch (e) {}

      navigate('/gov/sandbox-trials');
    } catch (err: any) {
      console.error('Failed to create trial:', err);
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to submit sandbox test request.');
      setIsSubmitting(false);
    }
  };

  if (isHelpersLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-16">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gov-blue"></div>
        <p className="text-caption text-gray-500 mt-3">Connecting to state registry & department challenges...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#f0f2f5] min-h-screen py-8 px-4 sm:px-6 lg:px-8 text-slate-800 animate-fadeIn">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation */}
        <div className="mb-4 flex items-center justify-between">
          <Link
            to="/gov/sandbox-trials"
            className="text-xs font-semibold text-slate-600 hover:text-blue-900 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sandbox Register
          </Link>
          <span className="text-[11px] font-mono text-blue-900 bg-blue-100/70 px-2 py-0.5 border border-blue-200 font-semibold">
            Maharashtra Innovation Framework • GFR 149 Direct Pilot
          </span>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-[#0c2340] to-[#15345c] text-white p-6 rounded-t-sm shadow-md border-b-4 border-amber-500">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300 mb-1">
            <FlaskConical className="w-4 h-4 text-amber-400" />
            <span>Pre-Procurement Testing & Validation Sandbox</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Sanction Controlled Field Sandbox Test (90-Day Pilot)
          </h1>
          <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
            Formally mandate a live deployment test in a real district, ward, or agency corridor. All metrics are recorded directly in PostgreSQL and audited by an Independent Third-Party Validator.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 p-8 shadow-sm space-y-6">
          
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Stakeholders */}
          <div className="border-b border-slate-100 pb-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-900" />
              1. Stakeholder Selection & Department Linkage
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Selected Verified Startup <span className="text-red-500">*</span>
                </label>
                <select 
                  className="input-field w-full text-xs font-semibold"
                  value={startupId}
                  onChange={(e) => setStartupId(e.target.value)}
                  required
                >
                  {helpers?.startups?.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.companyName} — {s.productSolutionName} ({s.dpiitRecognitionNumber})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">Verified DPIIT startup eligible under Maharashtra GFR 149</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Related Reverse Challenge (Optional)
                </label>
                <select 
                  className="input-field w-full text-xs font-semibold"
                  value={challengeId}
                  onChange={(e) => setChallengeId(e.target.value)}
                >
                  <option value="">-- No Direct Challenge (Direct Startup Runway Pilot) --</option>
                  {helpers?.challenges?.map((c) => (
                    <option key={c.id} value={c.id}>
                      [{c.challengeReferenceNumber}] {c.titleEnglish}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">Links milestone outcomes to problem statement</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Assigned Independent Validator Panel <span className="text-red-500">*</span>
              </label>
              <select 
                className="input-field w-full text-xs font-semibold"
                value={validatorUserId}
                onChange={(e) => setValidatorUserId(e.target.value)}
                required
              >
                {helpers?.validators?.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.username} ({v.email}) — Third-Party Verification Authority
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 mt-1">Audits live telemetry before issuing commercial GeM purchase order recommendation.</p>
            </div>
          </div>

          {/* Section 2: Environment & Scope */}
          <div className="border-b border-slate-100 pb-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-900" />
              2. Sandbox Testing Environment & Field Parameters
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Testing Environment <span className="text-red-500">*</span>
                </label>
                <select 
                  className="input-field w-full text-xs"
                  value={testingEnvironment}
                  onChange={(e) => setTestingEnvironment(e.target.value)}
                >
                  <option value="Municipal Field Sandbox">Municipal Field Sandbox</option>
                  <option value="Controlled Agency Corridor">Controlled Agency Corridor</option>
                  <option value="Laboratory Simulation">Laboratory Simulation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Duration (Days) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  min="15" 
                  max="180"
                  className="input-field w-full text-xs font-mono font-semibold"
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Max Sandbox Escrow Budget (₹) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number"
                  step="50000"
                  className="input-field w-full text-xs font-mono font-semibold text-emerald-800"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Pilot Location / Geographical Site <span className="text-red-500">*</span>
              </label>
              <input 
                type="text"
                className="input-field w-full text-xs"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Pune Smart City 12-Junction Corridor or Ward 4 Municipal Stormwater Channel"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Pilot Objective & Core Thesis <span className="text-red-500">*</span>
              </label>
              <textarea 
                rows={2}
                className="input-field w-full text-xs"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Expected Operational Outcomes
                </label>
                <textarea 
                  rows={2}
                  className="input-field w-full text-xs"
                  value={expectedOutcomes}
                  onChange={(e) => setExpectedOutcomes(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Risk & Safety Mitigation Plan
                </label>
                <textarea 
                  rows={2}
                  className="input-field w-full text-xs"
                  value={riskMitigation}
                  onChange={(e) => setRiskMitigation(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Dynamic KPIs */}
          <div className="border-b border-slate-100 pb-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-900" />
                  3. Key Performance Indicators (KPIs)
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Mathematical metrics verified by independent sensors or audit logs during field testing.
                </p>
              </div>
              <button 
                type="button" 
                onClick={handleAddKpi}
                className="text-xs font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded border border-blue-200 flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Another KPI
              </button>
            </div>

            <div className="space-y-3">
              {kpis.map((kpi, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-md border border-slate-200 relative space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                      KPI #{idx + 1}
                    </span>
                    {kpis.length > 1 && (
                      <button 
                        type="button"
                        onClick={() => handleRemoveKpi(idx)}
                        className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">KPI Name *</label>
                      <input 
                        type="text" 
                        value={kpi.name}
                        onChange={(e) => handleKpiChange(idx, 'name', e.target.value)}
                        placeholder="e.g. Peak-Hour Transit Delay"
                        className="input-field w-full text-xs font-medium"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Unit (e.g. min, %, ms) *</label>
                      <input 
                        type="text" 
                        value={kpi.unit}
                        onChange={(e) => handleKpiChange(idx, 'unit', e.target.value)}
                        placeholder="min"
                        className="input-field w-full text-xs font-medium"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Baseline *</label>
                        <input 
                          type="number" 
                          step="any"
                          value={kpi.baselineValue}
                          onChange={(e) => handleKpiChange(idx, 'baselineValue', e.target.value)}
                          className="input-field w-full text-xs font-mono font-semibold"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Target *</label>
                        <input 
                          type="number" 
                          step="any"
                          value={kpi.targetValue}
                          onChange={(e) => handleKpiChange(idx, 'targetValue', e.target.value)}
                          className="input-field w-full text-xs font-mono font-semibold text-emerald-800"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Description</label>
                      <input 
                        type="text" 
                        value={kpi.description}
                        onChange={(e) => handleKpiChange(idx, 'description', e.target.value)}
                        placeholder="Explain operational context"
                        className="input-field w-full text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Measurement Method *</label>
                      <input 
                        type="text" 
                        value={kpi.measurementMethod}
                        onChange={(e) => handleKpiChange(idx, 'measurementMethod', e.target.value)}
                        placeholder="e.g. Optical CCTV feed vs manual counter"
                        className="input-field w-full text-xs"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Escrow Tranches (30-40-30 Model) */}
          <div className="bg-blue-50/50 p-4 rounded border border-blue-200 space-y-2 text-xs">
            <h3 className="font-bold text-blue-900 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              Standard Maharashtra Sandbox Escrow Protocol (30% - 40% - 30%)
            </h3>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Funds are held under state treasury escrow. Tranches release only upon verified stage completion:
              <br />
              • <strong>Stage 1 (30% / ₹{(budget * 0.3).toLocaleString('en-IN')})</strong>: Field Mobilization & Calibration.
              <br />
              • <strong>Stage 2 (40% / ₹{(budget * 0.4).toLocaleString('en-IN')})</strong>: Mid-term telemetry review meeting 60%+ KPI target.
              <br />
              • <strong>Stage 3 (30% / ₹{(budget * 0.3).toLocaleString('en-IN')})</strong>: Independent Validator completion signoff.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <Link
              to="/gov/sandbox-trials"
              className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs uppercase tracking-wider rounded shadow flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Sanctioning Sandbox...' : 'Submit & Sanction Field Trial'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default RequestTestingSandbox;

import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sandboxApi } from '../../services/api/sandbox';
import { 
  FlaskConical, 
  CheckCircle2, 
  Clock, 
  Building2, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  ArrowLeft, 
  Play, 
  Check, 
  X, 
  Send, 
  Plus, 
  AlertCircle,
  FileText,
  UserCheck,
  History,
  TrendingUp,
  Activity
} from 'lucide-react';

const SandboxTrialDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'kpis' | 'milestones' | 'scope' | 'history'>('kpis');

  // Measurement Modal State
  const [isMeasurementModalOpen, setIsMeasurementModalOpen] = useState(false);
  const [selectedKpiId, setSelectedKpiId] = useState<string>('');
  const [measurementValue, setMeasurementValue] = useState<number | ''>('');
  const [measurementNotes, setMeasurementNotes] = useState('');

  // Status Action Modal State
  const [statusAction, setStatusAction] = useState<string | null>(null);
  const [statusReason, setStatusReason] = useState('');

  const { data: trial, isLoading, error } = useQuery({
    queryKey: ['sandboxTrial', id],
    queryFn: () => sandboxApi.getTrialDetails(id!),
    enabled: !!id
  });

  const recordMeasurementMutation = useMutation({
    mutationFn: () => sandboxApi.recordMeasurement(id!, selectedKpiId, {
      value: Number(measurementValue),
      notes: measurementNotes
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sandboxTrial', id] });
      queryClient.invalidateQueries({ queryKey: ['sandboxTrials'] });
      setIsMeasurementModalOpen(false);
      setMeasurementValue('');
      setMeasurementNotes('');
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: (action: string) => sandboxApi.updateStatus(id!, action, statusReason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sandboxTrial', id] });
      queryClient.invalidateQueries({ queryKey: ['sandboxTrials'] });
      queryClient.invalidateQueries({ queryKey: ['govDashboardStats'] });
      setStatusAction(null);
      setStatusReason('');
    }
  });

  const approveMilestoneMutation = useMutation({
    mutationFn: (milestoneId: string) => sandboxApi.approveMilestone(id!, milestoneId, 'Approved by Project Director upon verified field inspection.'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sandboxTrial', id] });
    }
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-900"></div>
        <p className="text-xs text-slate-500 mt-3">Loading sandbox trial telemetry from PostgreSQL...</p>
      </div>
    );
  }

  if (error || !trial) {
    return (
      <div className="max-w-2xl mx-auto mt-12 bg-red-50 border border-red-200 text-red-700 p-6 rounded text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
        <h3 className="font-bold text-sm">Sandbox Trial Not Found</h3>
        <p className="text-xs">The requested trial record does not exist or you lack authorization to inspect it.</p>
        <Link to="/gov/sandbox-trials" className="text-xs font-bold text-blue-900 hover:underline block">
          ← Return to Sandbox Register
        </Link>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PILOT_ACTIVE':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">ACTIVE IN FIELD</span>;
      case 'APPROVED':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-900 border border-blue-300">APPROVED PILOT</span>;
      case 'VALIDATION_PENDING':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-purple-100 text-purple-900 border border-purple-300">VALIDATION PENDING</span>;
      case 'COMPLETED_SUCCESS':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-green-100 text-green-900 border border-green-300">COMPLETED SUCCESS (READY FOR PO)</span>;
      case 'SUBMITTED':
      case 'UNDER_REVIEW':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-900 border border-amber-300">UNDER REVIEW</span>;
      case 'REJECTED':
      case 'COMPLETED_FAILED':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800 border border-red-300">FAILED / REJECTED</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-800">{status}</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-fadeIn text-slate-800">
      
      {/* Navigation & Header */}
      <div>
        <Link to="/gov/sandbox-trials" className="text-xs font-semibold text-slate-600 hover:text-blue-900 flex items-center gap-1.5 mb-3">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Sandbox Testing Register
        </Link>

        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold bg-blue-50 text-blue-900 px-2 py-0.5 rounded border border-blue-200">
                {trial.trialReferenceNumber}
              </span>
              {getStatusBadge(trial.status)}
            </div>
            <h1 className="text-xl font-bold text-slate-900">{trial.title}</h1>
            <p className="text-xs text-slate-500 flex items-center gap-4">
              <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {trial.departmentName}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {trial.location}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Duration: {trial.durationDays} Days</span>
            </p>
          </div>

          {/* Workflow Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {trial.status === 'SUBMITTED' && (
              <button
                onClick={() => updateStatusMutation.mutate('APPROVE')}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" /> Approve Sanction
              </button>
            )}

            {trial.status === 'APPROVED' && (
              <button
                onClick={() => updateStatusMutation.mutate('START')}
                className="px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" /> Start Field Pilot
              </button>
            )}

            {trial.status === 'PILOT_ACTIVE' && (
              <button
                onClick={() => updateStatusMutation.mutate('REQUEST_VALIDATION')}
                className="px-3 py-1.5 bg-purple-900 hover:bg-purple-800 text-white text-xs font-bold rounded flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Request Independent Validation
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI & Summary Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Startup Partner</p>
          <p className="text-sm font-bold text-slate-900 mt-1 truncate">{trial.startupName}</p>
          <p className="text-[11px] text-slate-500 truncate">{trial.productSolutionName}</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Sanctioned Escrow Budget</p>
          <p className="text-lg font-bold font-mono text-emerald-800 mt-1">₹{Number(trial.maximumBudget).toLocaleString('en-IN')}</p>
          <p className="text-[11px] text-slate-500">30-40-30 Tranche Rule</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Overall KPI Progress</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg font-bold font-mono text-slate-900">{trial.overallKPIProgress}%</span>
            <div className="flex-1 bg-slate-200 rounded-full h-2">
              <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${Math.min(100, trial.overallKPIProgress)}%` }} />
            </div>
          </div>
          <p className="text-[11px] text-slate-500">Across {(trial.kpis || []).length} defined indicators</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Independent Validator</p>
          <p className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-blue-700" />
            {trial.validatorName || 'Not Assigned'}
          </p>
          <p className="text-[11px] text-slate-500">Third-Party Audit Body</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex gap-2">
        {[
          { key: 'kpis', label: `KPI Tracking (${(trial.kpis || []).length})`, icon: <Activity className="w-4 h-4" /> },
          { key: 'milestones', label: `Milestones & Escrow (${(trial.milestones || []).length})`, icon: <TrendingUp className="w-4 h-4" /> },
          { key: 'scope', label: 'Testing Scope & Safety', icon: <FileText className="w-4 h-4" /> },
          { key: 'history', label: `Audit Trail (${(trial.statusHistory || []).length})`, icon: <History className="w-4 h-4" /> }
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === t.key
                ? 'border-blue-900 text-blue-900 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* TAB CONTENT 1: KPIs */}
      {activeTab === 'kpis' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs text-slate-600">
              Measurable field parameters. New metric telemetry can be recorded directly with automated achievement calculation.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {(trial.kpis || []).map((kpi) => (
              <div key={kpi.id} className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{kpi.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{kpi.description}</p>
                    <span className="text-[11px] font-mono text-slate-400">Method: {kpi.measurementMethod}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-caption font-semibold text-slate-500 block uppercase">Achievement</span>
                      <span className="font-mono text-base font-bold text-emerald-700">{kpi.achievementPercentage}%</span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedKpiId(kpi.id);
                        setIsMeasurementModalOpen(true);
                      }}
                      className="px-3 py-1.5 bg-blue-50 text-blue-900 hover:bg-blue-100 border border-blue-200 text-xs font-bold rounded flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Log Measurement
                    </button>
                  </div>
                </div>

                {/* Values Comparison Strip */}
                <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded text-center">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-500">Baseline</p>
                    <p className="text-sm font-mono font-semibold text-slate-700">{kpi.baselineValue} {kpi.unit}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-500">Target Value</p>
                    <p className="text-sm font-mono font-bold text-blue-950">{kpi.targetValue} {kpi.unit}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-emerald-800">Latest Recorded</p>
                    <p className="text-sm font-mono font-bold text-emerald-700">{kpi.latestValue} {kpi.unit}</p>
                  </div>
                </div>

                {/* Measurement Logs */}
                {kpi.measurements && kpi.measurements.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Telemetry History:</h4>
                    <div className="divide-y divide-slate-100 text-xs">
                      {kpi.measurements.map((m) => (
                        <div key={m.id} className="py-2 flex items-center justify-between">
                          <div>
                            <span className="font-mono font-bold text-slate-900">{m.value} {kpi.unit}</span>
                            <span className="text-slate-500 ml-2">“{m.notes}”</span>
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {new Date(m.measuredAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} • {m.measuredByName}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: Milestones */}
      {activeTab === 'milestones' && (
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900">Stage Milestone Escrow Tranches (30-40-30 Rule)</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Escrow tranches release sequentially only after department approval of submitted field evidence.
            </p>
          </div>

          <div className="space-y-4">
            {(trial.milestones || []).map((m, idx) => (
              <div key={m.id} className="border border-slate-200 rounded p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-blue-900 uppercase">Stage {idx + 1} ({m.percentage}%)</span>
                    <h4 className="font-bold text-sm text-slate-900">{m.name}</h4>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-emerald-800">
                      ₹{Number(m.allocatedAmount).toLocaleString('en-IN')}
                    </span>
                    <span className={`px-2 py-0.5 text-[11px] font-bold rounded ${
                      m.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                      m.status === 'SUBMITTED' ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {m.status}
                    </span>
                  </div>
                </div>

                {m.evidenceSummary && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-100">
                    <strong>Evidence:</strong> {m.evidenceSummary}
                  </p>
                )}

                {m.remarks && (
                  <p className="text-xs text-emerald-800 bg-emerald-50/50 p-2 rounded">
                    <strong>Approval Notes:</strong> {m.remarks}
                  </p>
                )}

                {m.status === 'SUBMITTED' && (
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => approveMilestoneMutation.mutate(m.id)}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve Tranche Disbursement
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: Scope */}
      {activeTab === 'scope' && (
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">Approved Sandbox Scope & Parameters</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-bold text-slate-700 uppercase">Pilot Objective</p>
              <p className="mt-1 text-slate-600 leading-relaxed">{trial.objective}</p>
            </div>
            <div>
              <p className="font-bold text-slate-700 uppercase">Expected Outcomes</p>
              <p className="mt-1 text-slate-600 leading-relaxed">{trial.expectedOutcomes}</p>
            </div>
            <div>
              <p className="font-bold text-slate-700 uppercase">Testing Environment</p>
              <p className="mt-1 text-slate-600">{trial.testingEnvironment}</p>
            </div>
            <div>
              <p className="font-bold text-slate-700 uppercase">Risk & Safety Mitigation</p>
              <p className="mt-1 text-slate-600 leading-relaxed">{trial.riskMitigationPlan}</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: History */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs space-y-3">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">State Transition & Regulatory Audit Trail</h3>
          <div className="divide-y divide-slate-100 text-xs">
            {(trial.statusHistory || []).map((h) => (
              <div key={h.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-slate-800">{h.previousStatus} → {h.newStatus}</span>
                  <p className="text-slate-500 mt-0.5">{h.reason}</p>
                </div>
                <div className="text-right text-[11px] text-slate-400">
                  <p>{new Date(h.changedAt).toLocaleString('en-IN')}</p>
                  <p className="font-medium text-slate-600">{h.changedByName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Measurement Modal */}
      {isMeasurementModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Log Field Metric Measurement</h3>
            <p className="text-xs text-slate-500">Record an audited numerical value. The system will recalculate achievement mathematically.</p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Measured Value *</label>
                <input
                  type="number"
                  step="any"
                  className="input-field w-full text-xs font-mono font-bold"
                  value={measurementValue}
                  onChange={(e) => setMeasurementValue(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Enter measured value"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Field Observation / Notes *</label>
                <textarea
                  rows={2}
                  className="input-field w-full text-xs"
                  value={measurementNotes}
                  onChange={(e) => setMeasurementNotes(e.target.value)}
                  placeholder="e.g. Conducted during evening peak hours with 40 municipal buses."
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsMeasurementModalOpen(false)}
                className="px-3 py-1.5 border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={measurementValue === '' || !measurementNotes || recordMeasurementMutation.isPending}
                onClick={() => recordMeasurementMutation.mutate()}
                className="px-4 py-1.5 bg-blue-950 text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-blue-900 disabled:opacity-50"
              >
                {recordMeasurementMutation.isPending ? 'Logging...' : 'Save Measurement'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SandboxTrialDetails;

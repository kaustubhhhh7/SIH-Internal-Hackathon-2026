import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { sandboxApi, type SandboxTrialSummary } from '../../services/api/sandbox';
import { 
  FlaskConical, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Filter, 
  Building2, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Search,
  RefreshCw,
  Plus
} from 'lucide-react';

const SandboxTrials: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: trials = [], isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['sandboxTrials', selectedStatus, searchTerm],
    queryFn: () => sandboxApi.getTrials(
      selectedStatus !== 'ALL' ? selectedStatus : undefined,
      searchTerm || undefined
    )
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PILOT_ACTIVE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            Active In Field
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-900 border border-blue-300">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Approved Pilot
          </span>
        );
      case 'VALIDATION_PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-900 border border-purple-300">
            <Clock className="w-3.5 h-3.5" />
            Validator Review
          </span>
        );
      case 'COMPLETED_SUCCESS':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-900 border border-green-300">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Proven / Ready for PO
          </span>
        );
      case 'SUBMITTED':
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-900 border border-amber-300">
            <Clock className="w-3.5 h-3.5" />
            Department Review
          </span>
        );
      case 'REJECTED':
      case 'COMPLETED_FAILED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 border border-red-300">
            <AlertTriangle className="w-3.5 h-3.5" />
            Not Viable
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-800 border border-slate-300">
            {status}
          </span>
        );
    }
  };

  const activeCount = trials.filter(t => t.status === 'PILOT_ACTIVE').length;
  const reviewCount = trials.filter(t => t.status === 'SUBMITTED' || t.status === 'UNDER_REVIEW' || t.status === 'VALIDATION_PENDING').length;
  const provenCount = trials.filter(t => t.status === 'COMPLETED_SUCCESS').length;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold uppercase tracking-wider mb-2">
            <FlaskConical className="w-3.5 h-3.5 text-blue-700" />
            Controlled Field Sandbox Governance • GFR 149 Direct Pilot
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Government Pilot & Sandbox Testing Register
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Real-time PostgreSQL tracking of live pilot tests across Maharashtra districts before committing public funds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2 border border-slate-300 rounded bg-white text-slate-700 hover:bg-slate-50 transition shadow-xs cursor-pointer"
            title="Refresh Trials"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
          <Link
            to="/gov/request-sandbox"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded bg-blue-950 text-white hover:bg-blue-900 transition shadow-sm"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            Initiate Sandbox Pilot
          </Link>
        </div>
      </div>

      {/* Metrics Row (Derived Directly from PostgreSQL) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Sandbox Filings</p>
          <div className="flex items-baseline justify-between mt-2">
            <p className="text-2xl font-bold text-slate-900">{trials.length}</p>
            <span className="text-xs font-medium text-slate-500">PostgreSQL</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs border-l-4 border-l-emerald-500">
          <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Active In-Field Pilots</p>
          <div className="flex items-baseline justify-between mt-2">
            <p className="text-2xl font-bold text-emerald-700">{activeCount}</p>
            <span className="text-xs font-medium text-emerald-600">Telemetry Live</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs border-l-4 border-l-amber-500">
          <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider">In Review / Evaluation</p>
          <div className="flex items-baseline justify-between mt-2">
            <p className="text-2xl font-bold text-amber-700">{reviewCount}</p>
            <span className="text-xs font-medium text-amber-600">Stage Approvals</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs border-l-4 border-l-blue-900">
          <p className="text-xs font-semibold text-blue-900 uppercase tracking-wider">Proven for GeM PO</p>
          <div className="flex items-baseline justify-between mt-2">
            <p className="text-2xl font-bold text-blue-950">{provenCount}</p>
            <span className="text-xs font-medium text-blue-800">Rule 149 Exempt</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search trials by title, reference number, location, or startup..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-9 w-full text-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {['ALL', 'PILOT_ACTIVE', 'APPROVED', 'SUBMITTED', 'VALIDATION_PENDING', 'COMPLETED_SUCCESS'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap cursor-pointer ${
                selectedStatus === st
                  ? 'bg-blue-950 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'ALL' ? 'All Trials' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Trials Table */}
      {isLoading ? (
        <div className="bg-white rounded-lg border border-slate-200 p-12 flex flex-col items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
          <p className="text-xs text-slate-500">Querying live sandbox records from PostgreSQL...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-lg flex items-center justify-between">
          <span className="text-xs font-medium">Unable to load sandbox trials from server. Please check backend connection.</span>
          <button onClick={() => refetch()} className="px-3 py-1 bg-red-100 text-red-800 rounded text-xs font-bold">
            Retry
          </button>
        </div>
      ) : trials.length > 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="p-4">Trial ID & Title</th>
                <th className="p-4">Startup & Solution</th>
                <th className="p-4">Location / Environment</th>
                <th className="p-4">Budget (Escrow)</th>
                <th className="p-4">KPI Progress</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {trials.map((trial) => (
                <tr key={trial.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4">
                    <span className="font-mono text-[11px] font-bold text-blue-900 block">
                      {trial.trialReferenceNumber}
                    </span>
                    <Link 
                      to={`/gov/sandbox-trials/${trial.id}`}
                      className="font-semibold text-slate-900 hover:text-blue-900 transition-colors line-clamp-1 mt-0.5"
                    >
                      {trial.title}
                    </Link>
                    <span className="text-[11px] text-slate-400">Duration: {trial.durationDays} Days</span>
                  </td>

                  <td className="p-4">
                    <div className="font-medium text-slate-900">{trial.startupName}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">{trial.productSolutionName}</div>
                  </td>

                  <td className="p-4">
                    <div className="text-slate-800 font-medium line-clamp-1">{trial.location}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{trial.testingEnvironment}</div>
                  </td>

                  <td className="p-4">
                    <span className="font-mono font-bold text-slate-900">
                      ₹{Number(trial.maximumBudget).toLocaleString('en-IN')}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, trial.overallKPIProgress)}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs font-bold text-emerald-800">
                        {trial.overallKPIProgress}%
                      </span>
                    </div>
                  </td>

                  <td className="p-4">
                    {getStatusBadge(trial.status)}
                  </td>

                  <td className="p-4 text-right">
                    <Link
                      to={`/gov/sandbox-trials/${trial.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-900 hover:text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded border border-blue-200 transition-colors"
                    >
                      <span>Manage</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center space-y-3">
          <FlaskConical className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No sandbox trials found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {selectedStatus !== 'ALL' 
              ? `No trials match the filter '${selectedStatus}'.` 
              : 'Sanction your first controlled field sandbox pilot to begin testing deep-tech solutions.'}
          </p>
          <Link
            to="/gov/request-sandbox"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded bg-blue-950 text-white hover:bg-blue-900 transition mt-2"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            Sanction First Sandbox Trial
          </Link>
        </div>
      )}
    </div>
  );
};

export default SandboxTrials;

import { useTranslation } from 'react-i18next';
import { FileText, Plus, AlertCircle, Clock, CheckCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { govChallengeApi } from '../../services/api/challenges';

const GovDashboard = () => {
  const { t } = useTranslation();

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['govDashboardStats'],
    queryFn: async () => {
      try {
        return await govChallengeApi.getGovDashboard();
      } catch (err: any) {
        console.error('[GovDashboard] Failed to fetch dashboard data:', {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          message: err.message
        });
        throw err;
      }
    },
    retry: 1
  });

  const getStatusBadge = (status: any) => {
    const statusStr = typeof status === 'number' 
      ? ['Draft', 'InternalReview', 'Published', 'ApplicationsOpen', 'ApplicationsClosed', 'Cancelled'][status] || 'Draft'
      : String(status);

    switch(statusStr) {
      case 'Draft': 
      case '0':
        return <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-caption font-medium">Draft</span>;
      case 'InternalReview': 
      case '1':
        return <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full text-caption font-medium">In Review</span>;
      case 'Published': 
      case '2':
        return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-caption font-medium">Published</span>;
      case 'ApplicationsOpen': 
      case '3':
        return <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-caption font-medium">Accepting Apps</span>;
      case 'ApplicationsClosed': 
      case '4':
        return <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-caption font-medium">Closed</span>;
      default: 
        return <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-caption font-medium">{statusStr}</span>;
    }
  };

  const getErrorMessage = (err: any) => {
    if (!err) return null;
    if (err.response?.status === 401) {
      return 'Session expired or not authenticated. Please log in again.';
    }
    if (err.response?.status === 403) {
      return 'Access denied: Your account is not authorized as a verified Government Department.';
    }
    if (err.response?.status === 404) {
      return 'The dashboard service endpoint could not be reached. Please check backend connection.';
    }
    if (err.code === 'ERR_NETWORK') {
      return 'Unable to reach ASP.NET Core backend server at http://localhost:5015. Please ensure the backend is running.';
    }
    return err.response?.data?.message || 'Unable to load department data. Please check the server connection.';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center border-b border-gov-border pb-4">
        <div>
          <h2 className="text-page-title text-gov-blue">
            {t('dashboard.title')} - {data?.departmentName || 'Department'}
          </h2>
          <p className="text-caption text-gray-500 mt-0.5">
            Real-time government challenge management & procurement overview
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => refetch()} 
            disabled={isFetching}
            title="Refresh Dashboard"
            className="p-2 text-gray-500 hover:text-gov-blue hover:bg-gray-100 rounded-md transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
          <Link to="/gov/challenges/create" className="btn-primary flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            {t('challenge.create')}
          </Link>
        </div>
      </div>

      {/* KPI Cards — Derived directly from PostgreSQL */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card border-l-4 border-l-gov-blue flex items-center justify-between">
          <div>
            <p className="text-caption text-gray-500">Active Challenges</p>
            <p className="text-number-large text-gray-800 mt-1">{data?.activeChallenges ?? 0}</p>
          </div>
          <FileText className="w-8 h-8 text-gov-blue opacity-20" />
        </div>
        <div className="card border-l-4 border-l-indigo-500 flex items-center justify-between">
          <div>
            <p className="text-caption text-gray-500">Total Applications</p>
            <div className="text-number-large mt-1 text-gray-800">{data?.totalApplications ?? 0}</div>
          </div>
          <AlertCircle className="w-8 h-8 text-indigo-500 opacity-20" />
        </div>
        <div className="card border-l-4 border-l-amber-500 flex items-center justify-between">
          <div>
            <p className="text-caption text-gray-500">Under Evaluation</p>
            <p className="text-number-large text-gray-800 mt-1">{data?.underEvaluation ?? 0}</p>
          </div>
          <Clock className="w-8 h-8 text-amber-500 opacity-20" />
        </div>
        <div className="card border-l-4 border-l-purple-500 flex items-center justify-between">
          <div>
            <p className="text-caption text-gray-500">Active Pilots</p>
            <p className="text-number-large text-gray-800 mt-1">{data?.activePilots ?? 0}</p>
          </div>
          <CheckCircle className="w-8 h-8 text-purple-500 opacity-20" />
        </div>
      </div>

      {/* Recent Challenges Section */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
          <h3 className="text-section-title border-none pb-0">Recent Challenges</h3>
          {data?.recentChallenges && data.recentChallenges.length > 0 && (
            <Link to="/gov/challenges" className="text-nav text-gov-blue hover:underline">View All</Link>
          )}
        </div>
        
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gov-border p-12 flex flex-col items-center justify-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gov-blue"></div>
            <p className="text-caption text-gray-500">Connecting to Department records...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-lg flex flex-col gap-2">
            <div className="flex items-center gap-2 font-semibold text-small">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span>{getErrorMessage(error)}</span>
            </div>
            <p className="text-caption text-red-600 ml-7">
              Check console logs for technical diagnostics. If your session expired, please log out and sign in as Government Department.
            </p>
            <div className="ml-7 mt-1">
              <button 
                onClick={() => refetch()} 
                className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 rounded text-xs font-semibold"
              >
                Retry Request
              </button>
            </div>
          </div>
        ) : data?.recentChallenges && data.recentChallenges.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gov-border overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 text-caption text-gray-600">Ref Number</th>
                  <th className="p-4 text-caption text-gray-600">Title</th>
                  <th className="p-4 text-caption text-gray-600">Status</th>
                  <th className="p-4 text-caption text-gray-600">Deadline</th>
                  <th className="p-4 text-caption text-gray-600">Applications</th>
                  <th className="p-4 text-caption text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.recentChallenges.map((challenge) => (
                  <tr key={challenge.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-small font-medium text-gray-900 font-mono">
                      {challenge.challengeReferenceNumber || 'DRAFT'}
                    </td>
                    <td className="p-4 text-small text-gray-700">
                      <div className="font-medium text-gray-900">{challenge.titleEnglish || 'Untitled Challenge'}</div>
                      <div className="text-caption text-gray-500 mt-0.5">{challenge.sector}</div>
                    </td>
                    <td className="p-4 text-small">
                      {getStatusBadge(challenge.status)}
                    </td>
                    <td className="p-4 text-small text-gray-600">
                      {challenge.submissionClosingDate 
                        ? new Date(challenge.submissionClosingDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                        : 'Rolling'}
                    </td>
                    <td className="p-4 text-small text-gray-700 font-semibold">{challenge.applicationCount}</td>
                    <td className="p-4 text-small">
                      <Link to={`/gov/challenges/${challenge.id}`} className="text-nav text-gov-blue hover:text-blue-800 font-medium">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gov-border p-8 text-center">
            <div className="flex justify-center mb-4">
              <FileText className="w-12 h-12 text-gray-300" />
            </div>
            <h4 className="text-card-title text-gray-900">No challenges created yet</h4>
            <p className="mt-1 text-body text-gray-500">Get started by creating a new problem statement.</p>
            <div className="mt-4">
              <Link to="/gov/challenges/create" className="btn-secondary inline-flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                {t('challenge.create')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GovDashboard;


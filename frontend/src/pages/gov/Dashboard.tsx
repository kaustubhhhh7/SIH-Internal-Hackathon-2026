import { useTranslation } from 'react-i18next';
import { FileText, Plus, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { govChallengeApi } from '../../services/api/challenges';

const GovDashboard = () => {
  const { t } = useTranslation();

  const { data, isLoading, error } = useQuery({
    queryKey: ['govChallenges', 1],
    queryFn: () => govChallengeApi.getDepartmentChallenges(1, 10),
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Draft': return <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-caption">Draft</span>;
      case 'InternalReview': return <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full text-caption">In Review</span>;
      case 'Published': return <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-caption">Published</span>;
      case 'ApplicationsOpen': return <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-caption">Accepting Apps</span>;
      case 'ApplicationsClosed': return <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-caption">Closed</span>;
      default: return <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-caption">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center border-b border-gov-border pb-4">
        <h2 className="text-page-title text-gov-blue">{t('dashboard.title')} - Department</h2>
        <Link to="/gov/challenges/create" className="btn-primary flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          {t('challenge.create')}
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card border-l-4 border-l-gov-blue flex items-center justify-between">
          <div>
            <p className="text-caption text-gray-500">Active Challenges</p>
            <p className="text-number-large text-gray-800 mt-1">{data?.totalItems || 0}</p>
          </div>
          <FileText className="w-8 h-8 text-gov-blue opacity-20" />
        </div>
        <div className="card border-l-4 border-l-indigo-500 flex items-center justify-between">
          <div>
            <p className="text-caption text-gray-500">Total Applications</p>
            <div className="text-number-large mt-1 text-gray-800">{data?.items.reduce((acc: number, curr: any) => acc + curr.applicationCount, 0) || 0}</div>
          </div>
          <AlertCircle className="w-8 h-8 text-indigo-500 opacity-20" />
        </div>
        <div className="card border-l-4 border-l-green-500 flex items-center justify-between">
          <div>
            <p className="text-caption text-gray-500">Under Evaluation</p>
            <p className="text-number-large text-gray-800 mt-1">0</p>
          </div>
          <Clock className="w-8 h-8 text-green-500 opacity-20" />
        </div>
        <div className="card border-l-4 border-l-purple-500 flex items-center justify-between">
          <div>
            <p className="text-caption text-gray-500">Active Pilots</p>
            <p className="text-number-large text-gray-800 mt-1">0</p>
          </div>
          <CheckCircle className="w-8 h-8 text-purple-500 opacity-20" />
        </div>
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
          <h3 className="text-section-title border-none pb-0">Recent Challenges</h3>
          {data?.items && data.items.length > 0 && (
            <Link to="/gov/challenges" className="text-nav text-gov-blue hover:underline">View All</Link>
          )}
        </div>
        
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gov-border p-12 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gov-blue"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">Error loading challenges. Please try again later.</div>
        ) : data?.items && data.items.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gov-border overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 text-caption text-gray-600">Ref Number</th>
                  <th className="p-4 text-caption text-gray-600">Title</th>
                  <th className="p-4 text-caption text-gray-600">Status</th>
                  <th className="p-4 text-caption text-gray-600">Applications</th>
                  <th className="p-4 text-caption text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.items.map((challenge: any) => (
                  <tr key={challenge.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-small font-medium text-gray-900">{challenge.challengeReferenceNumber || 'DRAFT'}</td>
                    <td className="p-4 text-small text-gray-700">
                      <div className="font-medium text-gray-900">{challenge.titleEnglish || 'Untitled Challenge'}</div>
                      <div className="text-caption text-gray-500 mt-1">{challenge.sector}</div>
                    </td>
                    <td className="p-4 text-small">
                      {getStatusBadge(challenge.status)}
                    </td>
                    <td className="p-4 text-small text-gray-700 font-medium">{challenge.applicationCount}</td>
                    <td className="p-4 text-small">
                      <Link to={`/gov/challenges/${challenge.id}`} className="text-nav text-gov-blue hover:text-blue-800">View Details</Link>
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


import { useTranslation } from 'react-i18next';
import { FileText, PlayCircle, CreditCard, Activity } from 'lucide-react';

const StartupDashboard = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center border-b border-gov-border pb-4">
        <h2 className="text-page-title text-gov-blue">{t('dashboard.title')}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card flex items-center space-x-4 border-l-4 border-l-gov-blue">
          <div className="p-3 bg-blue-50 rounded-full text-gov-blue">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-caption text-gray-500">{t('dashboard.profileCompletion')}</p>
            <p className="text-number-large text-gray-800 mt-1">45%</p>
          </div>
        </div>

        <div className="card flex items-center space-x-4 border-l-4 border-l-green-500">
          <div className="p-3 bg-green-50 rounded-full text-green-600">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-caption text-gray-500">My Applications</p>
            <p className="text-number-large text-gray-800 mt-1">0</p>
          </div>
        </div>

        <div className="card flex items-center space-x-4 border-l-4 border-l-purple-500">
          <div className="p-3 bg-purple-50 rounded-full text-purple-600">
            <PlayCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-caption text-gray-500">Active Pilots</p>
            <p className="text-number-large text-gray-800 mt-1">0</p>
          </div>
        </div>

        <div className="card flex items-center space-x-4 border-l-4 border-l-yellow-500">
          <div className="p-3 bg-yellow-50 rounded-full text-yellow-600">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-caption text-gray-500">Pending Payments</p>
            <p className="text-number-large text-gray-800 mt-1">₹0</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-section-title mb-4 border-none pb-0">Available Challenges</h3>
        <div className="bg-white rounded-lg shadow-sm border border-gov-border p-8 text-center">
          <div className="flex justify-center mb-4">
            <FileText className="w-12 h-12 text-gray-300" />
          </div>
          <h4 className="text-card-title text-gray-900">No challenges available right now</h4>
          <p className="mt-1 text-body text-gray-500">Check back later when government departments post new problem statements.</p>
        </div>
      </div>
    </div>
  );
};

export default StartupDashboard;

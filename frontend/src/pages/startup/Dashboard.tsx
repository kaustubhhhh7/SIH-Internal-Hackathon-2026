
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, PlayCircle, CreditCard, Activity, Building2, ShieldCheck, Tag } from 'lucide-react';
import { getMyStartupProfile } from '../../services/api/auth';

const StartupDashboard = () => {
  const { t } = useTranslation();
  const [startupProfile, setStartupProfile] = useState<any>(null);

  useEffect(() => {
    // 1. Try reading from localStorage first for instant display
    const cached = localStorage.getItem('startupProfile');
    if (cached) {
      try {
        setStartupProfile(JSON.parse(cached));
      } catch {}
    }

    // 2. Fetch fresh details from database API
    getMyStartupProfile()
      .then((res) => {
        if (res?.data) {
          setStartupProfile(res.data);
          localStorage.setItem('startupProfile', JSON.stringify(res.data));
        }
      })
      .catch((err) => {
        console.log('Could not fetch remote profile:', err);
      });
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Startup Profile Identity Card */}
      {startupProfile && (
        <div className="bg-gradient-to-r from-[#0c2340] to-blue-900 text-white rounded-xl p-6 shadow-md border border-blue-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">{startupProfile.companyName || 'Registered Startup'}</h3>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verified Entity
                </span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-300">
                <span>DPIIT: <strong className="text-white">{startupProfile.dpiitRecognitionNumber || 'N/A'}</strong></span>
                <span>•</span>
                <span>PAN: <strong className="text-white">{startupProfile.pan || 'N/A'}</strong></span>
                {startupProfile.productSolutionName && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3 text-amber-400" />
                      Product: <strong className="text-amber-200">{startupProfile.productSolutionName}</strong>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-300 bg-black/20 px-3 py-2 rounded border border-white/10 shrink-0">
            <div>Status: <span className="text-emerald-400 font-bold">Active in State Innovation Register</span></div>
          </div>
        </div>
      )}

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

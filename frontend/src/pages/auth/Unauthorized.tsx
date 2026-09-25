import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  ArrowLeft, 
  Home, 
  LogOut, 
  HelpCircle, 
  Lock, 
  AlertTriangle,
  UserCheck
} from 'lucide-react';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const userRole = localStorage.getItem('userRole') || 'ANONYMOUS';
  const userEmail = localStorage.getItem('userEmail') || localStorage.getItem('userName') || 'Authorized User';

  // Format role for user display
  const formatRole = (role: string) => {
    switch (role) {
      case 'PROCUREMENT_OFFICER':
        return 'Chief Procurement Officer';
      case 'GOVERNMENT_DEPARTMENT':
        return 'Government Department Officer';
      case 'INDEPENDENT_VALIDATOR':
        return 'Independent Validator (COEP / IIT)';
      case 'EXPERT_EVALUATOR':
        return 'Technical Expert Evaluator';
      case 'STARTUP':
        return 'DPIIT Registered Startup';
      case 'ADMINISTRATOR':
        return 'State Nodal Administrator';
      default:
        return role;
    }
  };

  const getDashboardPath = (role: string) => {
    switch (role) {
      case 'PROCUREMENT_OFFICER':
        return '/procurement/dashboard';
      case 'GOVERNMENT_DEPARTMENT':
        return '/gov/dashboard';
      case 'INDEPENDENT_VALIDATOR':
        return '/validator/dashboard';
      case 'EXPERT_EVALUATOR':
        return '/expert/dashboard';
      case 'STARTUP':
        return '/startup/dashboard';
      case 'ADMINISTRATOR':
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    setShowLogoutConfirm(false);
    navigate('/login');
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        
        {/* Top Header Card */}
        <div className="bg-white border border-slate-300 rounded-sm shadow-md overflow-hidden animate-fadeIn">
          
          {/* Banner */}
          <div className="bg-gradient-to-r from-red-900 via-slate-900 to-slate-950 p-6 text-white text-center border-b-4 border-amber-500">
            <div className="w-16 h-16 bg-red-100/10 border border-red-400/30 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
              <ShieldAlert className="w-9 h-9 text-red-400 animate-pulse" />
            </div>
            <span className="text-[11px] font-mono tracking-widest text-amber-400 uppercase font-bold bg-black/40 px-3 py-1 rounded">
              STATUTORY RESTRICTION • PROTOCOL 403
            </span>
            <h1 className="text-xl sm:text-2xl font-black mt-2 tracking-tight">
              Access Restricted / Unauthorized
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
              Maharashtra State Innovation & Procurement Gateway Security Boundary
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Explanation Notice */}
            <div className="bg-red-50/70 border border-red-200 p-4 rounded text-xs space-y-2 text-slate-700">
              <div className="flex items-center gap-2 text-red-900 font-bold uppercase tracking-wide">
                <AlertTriangle className="w-4 h-4 text-red-700 shrink-0" />
                Role Clearance Protocol Mismatch
              </div>
              <p className="leading-relaxed">
                You have reached an administrative corridor restricted to specific designated government authorities or evaluation panels. Your authenticated session does not possess the requisite statutory clearance for this specific endpoint.
              </p>
            </div>

            {/* Current Session Info */}
            <div className="bg-slate-50 border border-slate-200 rounded p-4 text-xs space-y-2.5">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-slate-400" /> Active Session:
                </span>
                <span className="font-semibold text-slate-800">{userEmail}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" /> Assigned Security Role:
                </span>
                <span className="font-bold text-amber-800 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded font-mono text-[11px]">
                  {formatRole(userRole)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 text-[11px] text-slate-500">
                <span>Compliance Authority:</span>
                <span className="font-mono text-slate-600">GFR Rule 149 / IT Policy 2026</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <Link
                to={getDashboardPath(userRole)}
                className="w-full btn-primary py-2.5 px-4 text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 shadow-xs"
              >
                <Home className="w-4 h-4" />
                <span>Return to My Role Dashboard</span>
              </Link>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="btn-secondary py-2 px-3 text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Go Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="py-2 px-3 text-xs uppercase tracking-wider font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded flex items-center justify-center gap-1.5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Switch Account</span>
                </button>
              </div>
            </div>

            {/* Footer Support */}
            <div className="pt-4 border-t border-slate-200 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>Need upgraded permissions? </span>
              <Link to="/raise-ticket" className="text-blue-900 font-semibold hover:underline">
                Submit Access Request
              </Link>
            </div>

          </div>
        </div>

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-sm w-full overflow-hidden animate-fadeIn">
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4 mx-auto">
                  <LogOut className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-center text-gray-900 mb-2">Confirm Logout</h3>
                <p className="text-sm text-center text-gray-600 mb-6">
                  Are you sure you want to log out of your account?
                </p>
                <div className="flex gap-3">
                  <button 
                    onClick={cancelLogout}
                    className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={confirmLogout}
                    className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Unauthorized;

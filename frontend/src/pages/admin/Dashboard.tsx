import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, Building, Activity, Shield, RefreshCw, Search, CheckCircle, 
  XCircle, Plus, Settings, FileText, ArrowUpRight, 
  Layers, Lock, Sliders, Sparkles
} from 'lucide-react';
import { 
  adminApi, 
  type AdminDashboardStatsDto, 
  type AdminUserDto, 
  type AdminDepartmentDto, 
  type AdminStartupDto, 
  type AdminAuditLogDto, 
  type AdminSystemSettingDto 
} from '../../services/api/admin';
import { aiAgentsApi, type VerifyStartupResponse } from '../../services/api/aiAgents';

interface AdminDashboardProps {
  defaultTab?: 'overview' | 'users' | 'departments' | 'startups' | 'settings';
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ defaultTab = 'overview' }) => {
  const { i18n } = useTranslation();
  const isMr = i18n.language === 'mr';
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'departments' | 'startups' | 'settings'>(defaultTab);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [stats, setStats] = useState<AdminDashboardStatsDto | null>(null);
  const [users, setUsers] = useState<AdminUserDto[]>([]);
  const [departments, setDepartments] = useState<AdminDepartmentDto[]>([]);
  const [startups, setStartups] = useState<AdminStartupDto[]>([]);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLogDto[]>([]);
  const [settingsList, setSettingsList] = useState<AdminSystemSettingDto[]>([]);

  // Filter & Search states
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // New Department modal
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptDesc, setNewDeptDesc] = useState('');
  const [deptSubmitting, setDeptSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [auditData, setAuditData] = useState<{ report: VerifyStartupResponse, startup: AdminStartupDto } | null>(null);

  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const [statsData, usersData, deptsData, startupsData, logsData, settingsData] = await Promise.all([
        adminApi.getDashboardStats(),
        adminApi.getUsers(),
        adminApi.getDepartments(),
        adminApi.getStartups(),
        adminApi.getAuditLogs(30),
        adminApi.getSettings()
      ]);

      setStats(statsData);
      setUsers(usersData);
      setDepartments(deptsData);
      setStartups(startupsData);
      setAuditLogs(logsData);
      setSettingsList(settingsData);
    } catch (err: unknown) {
      console.error('Error fetching admin dashboard data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to administrative services.';
      setError(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleUser = async (user: AdminUserDto) => {
    try {
      setActionLoadingId(user.id);
      const res = await adminApi.toggleUserStatus(user.id);
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isActive: res.isActive } : u));
      showToast(res.message);
      // Refresh stats in background
      adminApi.getDashboardStats().then(setStats).catch(() => {});
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error updating user status';
      alert(errorMessage);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleDepartment = async (dept: AdminDepartmentDto) => {
    try {
      setActionLoadingId(dept.id);
      const res = await adminApi.toggleDepartmentStatus(dept.id);
      setDepartments(prev => prev.map(d => d.id === dept.id ? { ...d, isActive: res.isActive } : d));
      showToast(`Department ${res.isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (err: unknown) {
      console.error(err);
      alert('Error updating department status');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCreateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName.trim()) return;

    try {
      setDeptSubmitting(true);
      const res = await adminApi.createDepartment({
        name: newDeptName.trim(),
        description: newDeptDesc.trim()
      });
      setDepartments(prev => [res.department, ...prev]);
      setShowDeptModal(false);
      setNewDeptName('');
      setNewDeptDesc('');
      showToast('New Department onboarded successfully!');
      adminApi.getDashboardStats().then(setStats).catch(() => {});
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to onboard department.';
      alert(errorMessage);
    } finally {
      setDeptSubmitting(false);
    }
  };

  const handleToggleStartupVerification = async (startup: AdminStartupDto, approve: boolean) => {
    try {
      setActionLoadingId(startup.id);
      const res = await adminApi.toggleStartupVerification(startup.id, approve);
      setStartups(prev => prev.map(s => s.id === startup.id ? { ...s, verificationStatus: res.verificationStatus } : s));
      showToast(res.message);
      adminApi.getDashboardStats().then(setStats).catch(() => {});
    } catch (err: unknown) {
      console.error(err);
      alert('Failed to update startup verification status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleUpdateSetting = async (key: string, value: string) => {
    try {
      setActionLoadingId(key);
      await adminApi.updateSetting({ settingKey: key, settingValue: value });
      setSettingsList(prev => prev.map(s => s.settingKey === key ? { ...s, settingValue: value, updatedAt: new Date().toISOString() } : s));
      showToast(`Setting ${key} updated successfully.`);
    } catch (err: unknown) {
      console.error(err);
      alert('Failed to update setting.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchSearch = userSearch === '' || 
      u.username.toLowerCase().includes(userSearch.toLowerCase()) || 
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.mobileNumber.includes(userSearch);
    const matchRole = userRoleFilter === '' || u.roles.includes(userRoleFilter);
    return matchSearch && matchRole;
  });

  const formatRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMINISTRATOR':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">Admin</span>;
      case 'STARTUP':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">Startup</span>;
      case 'GOVERNMENT_DEPARTMENT':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">Gov Dept</span>;
      case 'EXPERT_EVALUATOR':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">Evaluator</span>;
      case 'INDEPENDENT_VALIDATOR':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800 border border-teal-200">Validator</span>;
      case 'PROCUREMENT_OFFICER':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">Procurement</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">{role}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-lg shadow-xl border border-gray-700 flex items-center space-x-3 text-sm animate-bounce">
          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gov-border pb-4 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-xs font-bold bg-gov-blue text-white rounded uppercase tracking-wider">
              {isMr ? 'मुख्य प्रशासक नियंत्रण केंद्र' : 'Super Admin Command Center'}
            </span>
            <span className="flex items-center text-xs text-green-700 font-medium bg-green-50 px-2 py-0.5 rounded border border-green-200">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
              {isMr ? 'थेट डेटाबेस जोडणी' : 'Live PostgreSQL Database'}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gov-blue mt-1">
            {isMr ? 'राज्य नाविन्यपूर्ण खरेदी प्रशासन व नियमन' : 'State Innovation Governance & Administration'}
          </h2>
          <p className="text-sm text-gray-600">
            {isMr ? 'महाराष्ट्र राज्य नाविन्यपूर्ण सोसायटी (MSInS) • GFR १४९ नियामक चौकट' : 'Maharashtra State Innovation Society (MSInS) • GFR 149 Regulatory Framework'}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="flex items-center px-3.5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 shadow-sm transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 mr-2 text-gray-500 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? (isMr ? 'सिंक्रोनाइझ करत आहे...' : 'Syncing...') : (isMr ? 'डेटा सिंक्रोनाइझ करा' : 'Sync Live DB')}
          </button>
          <button
            onClick={() => setShowDeptModal(true)}
            className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-gov-blue rounded-md hover:bg-blue-800 shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-2" />
            {isMr ? '+ नवीन विभाग जोडा' : '+ Onboard Department'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center justify-between text-red-700">
          <div>
            <p className="font-semibold">{isMr ? 'बॅकएंड कनेक्शन चेतावणी' : 'Backend Connection Alert'}</p>
            <p className="text-sm">{error}</p>
          </div>
          <button onClick={() => loadData(true)} className="text-xs bg-red-100 px-3 py-1.5 rounded hover:bg-red-200 font-medium">
            {isMr ? 'पुन्हा प्रयत्न करा' : 'Retry'}
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Total Users */}
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 border-l-4 border-l-gov-blue hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-gray-500 tracking-wider">
              {isMr ? 'एकूण वापरकर्ते' : 'Total Users'}
            </span>
            <Users className="w-6 h-6 text-gov-blue opacity-70" />
          </div>
          <div className="mt-2 flex items-baseline">
            <span className="text-3xl font-extrabold text-gray-900">{loading ? '...' : (stats?.totalUsers ?? 0)}</span>
            <span className="ml-2 text-xs text-green-600 font-medium">
              {isMr ? 'RBAC सक्रिय' : 'RBAC Active'}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {isMr ? '६ अधिकृत भूमिकांमध्ये' : 'Across 6 Persona Roles'}
          </p>
        </div>

        {/* Registered Startups */}
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-gray-500 tracking-wider">
              {isMr ? 'स्टार्टअप्स' : 'Startups'}
            </span>
            <Activity className="w-6 h-6 text-green-600 opacity-70" />
          </div>
          <div className="mt-2 flex items-baseline">
            <span className="text-3xl font-extrabold text-gray-900">{loading ? '...' : (stats?.totalStartups ?? 0)}</span>
            <span className="ml-2 text-xs text-amber-600 font-medium">
              {isMr ? 'DPIIT प्रमाणित' : 'DPIIT Verified'}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {isMr ? 'डीप-टेक नवोन्मेषक' : 'Deep-Tech Innovators'}
          </p>
        </div>

        {/* Departments */}
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 border-l-4 border-l-indigo-500 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-gray-500 tracking-wider">
              {isMr ? 'शासकीय विभाग' : 'Departments'}
            </span>
            <Building className="w-6 h-6 text-indigo-600 opacity-70" />
          </div>
          <div className="mt-2 flex items-baseline">
            <span className="text-3xl font-extrabold text-gray-900">{loading ? '...' : (stats?.totalDepartments ?? 0)}</span>
            <span className="ml-2 text-xs text-indigo-600 font-medium">
              {isMr ? 'राज्य व महानगरपालिका' : 'State & Municipal'}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {isMr ? 'सक्रिय खरेदी संस्था' : 'Active Procurement Bodies'}
          </p>
        </div>

        {/* Active Challenges */}
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 border-l-4 border-l-amber-500 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-gray-500 tracking-wider">
              {isMr ? 'आव्हाने' : 'Challenges'}
            </span>
            <FileText className="w-6 h-6 text-amber-600 opacity-70" />
          </div>
          <div className="mt-2 flex items-baseline">
            <span className="text-3xl font-extrabold text-gray-900">{loading ? '...' : (stats?.activeChallenges ?? 0)}</span>
            <span className="ml-2 text-xs text-amber-600 font-medium">
              {isMr ? 'प्रकाशित' : 'Published'}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {isMr ? 'समस्या विधाने' : 'Reverse Problem Statements'}
          </p>
        </div>

        {/* Sandbox Pilots */}
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-gray-500 tracking-wider">
              {isMr ? 'सँडबॉक्स पायलट' : 'Sandbox Pilots'}
            </span>
            <Layers className="w-6 h-6 text-purple-600 opacity-70" />
          </div>
          <div className="mt-2 flex items-baseline">
            <span className="text-3xl font-extrabold text-gray-900">{loading ? '...' : (stats?.activePilots ?? 0)}</span>
            <span className="ml-2 text-xs text-purple-600 font-medium">
              {isMr ? '९०-दिवस' : '90-Day'}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {isMr ? 'सक्रिय फील्ड सँडबॉक्स' : 'Active Field Sandboxes'}
          </p>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 border-l-4 border-l-emerald-500 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-gray-500 tracking-wider">
              {isMr ? 'प्रणाली स्थिती' : 'System State'}
            </span>
            <Shield className="w-6 h-6 text-emerald-600 opacity-70" />
          </div>
          <div className="mt-2 flex items-baseline">
            <span className="text-2xl font-bold text-emerald-600">
              {stats?.systemHealth || (isMr ? 'सक्षम (Healthy)' : 'Healthy')}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Npgsql EF Core 10 OK</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg p-1.5 shadow-sm flex flex-wrap gap-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center px-4 py-2 text-sm font-semibold rounded-md transition-colors cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-gov-blue text-white shadow'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Activity className="w-4 h-4 mr-2" />
          {isMr ? 'थेट आढावा व ऑडिट ट्रेल' : 'Live Audit Trail & Overview'}
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center px-4 py-2 text-sm font-semibold rounded-md transition-colors cursor-pointer ${
            activeTab === 'users'
              ? 'bg-gov-blue text-white shadow'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Users className="w-4 h-4 mr-2" />
          {isMr ? `वापरकर्ते व भूमिका व्यवस्थापन (${users.length})` : `User & Role Governance (${users.length})`}
        </button>

        <button
          onClick={() => setActiveTab('departments')}
          className={`flex items-center px-4 py-2 text-sm font-semibold rounded-md transition-colors cursor-pointer ${
            activeTab === 'departments'
              ? 'bg-gov-blue text-white shadow'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Building className="w-4 h-4 mr-2" />
          {isMr ? `विभाग नोंदणी (${departments.length})` : `Department Onboarding (${departments.length})`}
        </button>

        <button
          onClick={() => setActiveTab('startups')}
          className={`flex items-center px-4 py-2 text-sm font-semibold rounded-md transition-colors cursor-pointer ${
            activeTab === 'startups'
              ? 'bg-gov-blue text-white shadow'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          {isMr ? `स्टार्टअप पडताळणी केंद्र (${startups.length})` : `Startup Verification Hub (${startups.length})`}
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center px-4 py-2 text-sm font-semibold rounded-md transition-colors cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-gov-blue text-white shadow'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Sliders className="w-4 h-4 mr-2" />
          {isMr ? 'प्रशासन धोरणे व सेटिंग्ज' : 'Governance Settings & Policies'}
        </button>
      </div>

      {/* TAB 1: OVERVIEW & AUDIT TRAIL */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Regulatory Status Box */}
            <div className="lg:col-span-1 bg-gradient-to-br from-blue-900 to-indigo-900 text-white rounded-lg p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-200">State Regulatory Shield</span>
                <Lock className="w-5 h-5 text-blue-300" />
              </div>
              <h3 className="text-lg font-bold mb-2">GFR Rule 149 Innovation Gateway</h3>
              <p className="text-sm text-blue-100 leading-relaxed mb-4">
                Public procurement compliance engine active. Startups with verified DPIIT recognition are legally exempted from:
              </p>
              <ul className="text-xs space-y-2 text-blue-100 mb-6">
                <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-400" /> ₹0 Earnest Money Deposit (EMD)</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-400" /> 0-Year prior turnover audit waiver</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-400" /> Direct Purchase Order via GeM post-sandbox</li>
              </ul>
              <div className="pt-4 border-t border-blue-700/60 flex items-center justify-between text-xs text-blue-200">
                <span>Database: SIH_2026_1</span>
                <span className="bg-blue-800 px-2 py-1 rounded">PostgreSQL 18</span>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-gov-blue" />
                Administrative Quick Actions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div 
                  onClick={() => setActiveTab('users')}
                  className="p-4 border border-gray-200 rounded-lg hover:border-gov-blue hover:bg-blue-50/50 cursor-pointer transition-all flex items-start space-x-3 group"
                >
                  <div className="p-2.5 rounded-lg bg-blue-100 text-gov-blue group-hover:bg-gov-blue group-hover:text-white transition-colors">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Manage System Users</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Toggle active state, verify access roles across 6 personas</p>
                  </div>
                </div>

                <div 
                  onClick={() => setShowDeptModal(true)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-indigo-600 hover:bg-indigo-50/50 cursor-pointer transition-all flex items-start space-x-3 group"
                >
                  <div className="p-2.5 rounded-lg bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Onboard State Department</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Register Municipal Corporations & Govt Directorates</p>
                  </div>
                </div>

                <div 
                  onClick={() => setActiveTab('startups')}
                  className="p-4 border border-gray-200 rounded-lg hover:border-green-600 hover:bg-green-50/50 cursor-pointer transition-all flex items-start space-x-3 group"
                >
                  <div className="p-2.5 rounded-lg bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Verify Startup DPIIT</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Review incorporation proof, PAN, and grant tender exemption</p>
                  </div>
                </div>

                <div 
                  onClick={() => setActiveTab('settings')}
                  className="p-4 border border-gray-200 rounded-lg hover:border-amber-600 hover:bg-amber-50/50 cursor-pointer transition-all flex items-start space-x-3 group"
                >
                  <div className="p-2.5 rounded-lg bg-amber-100 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Configure Sandbox Budget Caps</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Manage ₹25L pilot grant caps and test duration parameters</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900">Live Regulatory Audit Trail</h3>
                <p className="text-xs text-gray-500">Immutable, timestamped record of portal operations and security events</p>
              </div>
              <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">
                {auditLogs.length} Events Logged
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50 text-gray-600 font-semibold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3 text-left">Timestamp</th>
                    <th className="px-6 py-3 text-left">Actor / User</th>
                    <th className="px-6 py-3 text-left">Action Event</th>
                    <th className="px-6 py-3 text-left">Entity Affected</th>
                    <th className="px-6 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        No audit events recorded yet.
                      </td>
                    </tr>
                  ) : (
                    auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-3.5 whitespace-nowrap text-xs text-gray-500 font-mono">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="px-6 py-3.5 whitespace-nowrap">
                          <span className="font-medium text-gray-900">{log.username}</span>
                        </td>
                        <td className="px-6 py-3.5 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-gov-blue border border-blue-200 font-mono">
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 whitespace-nowrap text-xs text-gray-600">
                          {log.entityType} <span className="text-gray-400 font-mono">({log.entityId ? log.entityId.substring(0, 8) + '...' : 'Global'})</span>
                        </td>
                        <td className="px-6 py-3.5 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Logged
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER & ROLE GOVERNANCE */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">User Account Directory & RBAC Governance</h3>
              <p className="text-xs text-gray-500">Manage user access, security locks, and role assignments across the state</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search user, email, phone..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gov-blue w-60"
                />
              </div>

              {/* Role Filter */}
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="py-1.5 px-3 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gov-blue text-gray-700"
              >
                <option value="">All Roles ({users.length})</option>
                <option value="STARTUP">Startups</option>
                <option value="GOVERNMENT_DEPARTMENT">Government Departments</option>
                <option value="EXPERT_EVALUATOR">Expert Evaluators</option>
                <option value="INDEPENDENT_VALIDATOR">Independent Validators</option>
                <option value="PROCUREMENT_OFFICER">Procurement Officers</option>
                <option value="ADMINISTRATOR">Super Administrators</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 text-gray-600 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">User Identity</th>
                  <th className="px-6 py-3 text-left">Role Assigned</th>
                  <th className="px-6 py-3 text-left">Department / Startup</th>
                  <th className="px-6 py-3 text-left">Created Date</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No users match the search or filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gov-blue text-white flex items-center justify-center font-bold text-xs uppercase mr-3">
                            {user.username.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{user.username}</p>
                            <p className="text-xs text-gray-500">{user.email} • {user.mobileNumber}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map(r => (
                            <span key={r}>{formatRoleBadge(r)}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap text-xs text-gray-700">
                        {user.departmentName ? (
                          <span className="font-medium text-indigo-700">{user.departmentName}</span>
                        ) : user.startupCompanyName ? (
                          <span className="font-medium text-green-700">{user.startupCompanyName}</span>
                        ) : (
                          <span className="text-gray-400">State Headquarters</span>
                        )}
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap text-xs text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                          user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Active' : 'Deactivated'}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap text-right text-xs">
                        <button
                          onClick={() => handleToggleUser(user)}
                          disabled={actionLoadingId === user.id}
                          className={`px-3 py-1 rounded font-medium transition-colors ${
                            user.isActive 
                              ? 'text-red-700 bg-red-50 hover:bg-red-100 border border-red-200' 
                              : 'text-green-700 bg-green-50 hover:bg-green-100 border border-green-200'
                          }`}
                        >
                          {actionLoadingId === user.id ? 'Processing...' : user.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DEPARTMENT ONBOARDING */}
      {activeTab === 'departments' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">Government Departments & Municipal Bodies</h3>
              <p className="text-xs text-gray-500">Entities authorized to release challenge statements and fund sandbox pilot grants</p>
            </div>
            <button
              onClick={() => setShowDeptModal(true)}
              className="flex items-center px-4 py-2 text-xs font-semibold text-white bg-gov-blue rounded-md hover:bg-blue-800 shadow-sm"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Onboard New Department
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((dept) => (
              <div 
                key={dept.id} 
                className={`p-5 rounded-lg border transition-all ${
                  dept.isActive 
                    ? 'border-gray-200 bg-white hover:border-gov-blue hover:shadow-sm' 
                    : 'border-gray-200 bg-gray-50 opacity-75'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
                    <Building className="w-6 h-6" />
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    dept.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {dept.isActive ? 'Active Directorate' : 'Inactive'}
                  </span>
                </div>

                <h4 className="font-bold text-gray-900 mt-3">{dept.name}</h4>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{dept.description || 'Government of Maharashtra Administrative Department'}</p>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                  <span><strong>{dept.challengeCount}</strong> Challenges</span>
                  <span><strong>{dept.userCount}</strong> Officials</span>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleToggleDepartment(dept)}
                    disabled={actionLoadingId === dept.id}
                    className="text-xs text-gray-600 hover:text-gov-blue font-medium underline"
                  >
                    {actionLoadingId === dept.id ? 'Updating...' : dept.isActive ? 'Disable Department' : 'Enable Department'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: STARTUP VERIFICATION HUB */}
      {activeTab === 'startups' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-base font-bold text-gray-900">DPIIT Startup Verification & Regulatory Approval</h3>
            <p className="text-xs text-gray-500">
              Verify startup credentials to unlock General Financial Rules (GFR) 149 turnover and prior-track record exemptions
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 text-gray-600 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">Company Details</th>
                  <th className="px-6 py-3 text-left">DPIIT Number / PAN</th>
                  <th className="px-6 py-3 text-left">Product / Solution</th>
                  <th className="px-6 py-3 text-left">Stage</th>
                  <th className="px-6 py-3 text-left">Verification Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {startups.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No startups registered yet.
                    </td>
                  </tr>
                ) : (
                  startups.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3.5">
                        <p className="font-semibold text-gray-900">{s.companyName}</p>
                        <p className="text-xs text-gray-500">{s.userEmail}</p>
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap text-xs font-mono">
                        <div className="text-gov-blue font-bold">{s.dpiitRecognitionNumber || 'DIPP-PENDING'}</div>
                        <div className="text-gray-500">PAN: {s.pan || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-3.5 text-xs text-gray-700 max-w-xs truncate">
                        <span className="font-medium text-gray-900">{s.productSolutionName || 'Hardware/DeepTech'}</span>
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap text-xs text-gray-600">
                        <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-medium">
                          {s.currentProductStage || 'TRL-7'}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          s.verificationStatus === 'GovernmentVerified'
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : s.verificationStatus === 'Rejected'
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {s.verificationStatus === 'GovernmentVerified' ? '✓ DPIIT Approved' : s.verificationStatus === 'Rejected' ? '❌ Rejected' : '⏳ Pending Review'}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap text-right text-xs">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={async () => {
                              try {
                                setActionLoadingId(s.id);
                                const verifyRes = await aiAgentsApi.verifyStartup(s.id);
                                setAuditData({ report: verifyRes, startup: s });
                                setAuditModalOpen(true);
                              } catch (e) {
                                showToast('Failed to process AI check.');
                              } finally {
                                setActionLoadingId(null);
                              }
                            }}
                            disabled={actionLoadingId === s.id}
                            className="px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                            title="Run Agent 2 Autonomous Statutory Verification"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                            <span>AI Audit</span>
                          </button>

                          <button
                            onClick={() => handleToggleStartupVerification(s, true)}
                            disabled={actionLoadingId === s.id || s.verificationStatus === 'GovernmentVerified'}
                            className={`px-3 py-1 rounded font-semibold transition-colors cursor-pointer ${
                              s.verificationStatus === 'GovernmentVerified'
                                ? 'text-green-800 bg-green-100 border border-green-200 opacity-50 cursor-not-allowed'
                                : 'text-white bg-green-600 hover:bg-green-700 shadow-sm'
                            }`}
                          >
                            {actionLoadingId === s.id ? 'Processing...' : s.verificationStatus === 'GovernmentVerified' ? 'Approved' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleToggleStartupVerification(s, false)}
                            disabled={actionLoadingId === s.id || s.verificationStatus === 'Rejected'}
                            className={`px-3 py-1 rounded font-semibold transition-colors cursor-pointer ${
                              s.verificationStatus === 'Rejected'
                                ? 'text-red-800 bg-red-100 border border-red-200 opacity-50 cursor-not-allowed'
                                : 'text-red-700 bg-red-50 hover:bg-red-100 border border-red-200'
                            }`}
                          >
                            {actionLoadingId === s.id ? 'Processing...' : s.verificationStatus === 'Rejected' ? 'Rejected' : 'Reject'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: SYSTEM POLICIES & SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-base font-bold text-gray-900">Portal Governance Policies & Thresholds</h3>
            <p className="text-xs text-gray-500">Configure regulatory thresholds, sandbox grant limits, and tender exemption rules</p>
          </div>

          <div className="space-y-4">
            {settingsList.map((setting) => (
              <div key={setting.settingKey} className="p-4 border border-gray-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
                <div className="max-w-xl">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-gov-blue bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {setting.settingKey}
                    </span>
                    <span className="text-xs text-gray-400">Updated: {new Date(setting.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{setting.description}</p>
                </div>

                <div className="flex items-center space-x-3">
                  {setting.settingValue === 'ENABLED' || setting.settingValue === 'DISABLED' ? (
                    <button
                      onClick={() => handleUpdateSetting(setting.settingKey, setting.settingValue === 'ENABLED' ? 'DISABLED' : 'ENABLED')}
                      disabled={actionLoadingId === setting.settingKey}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                        setting.settingValue === 'ENABLED'
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                      }`}
                    >
                      {actionLoadingId === setting.settingKey ? 'Saving...' : setting.settingValue}
                    </button>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        defaultValue={setting.settingValue}
                        onBlur={(e) => {
                          if (e.target.value !== setting.settingValue) {
                            handleUpdateSetting(setting.settingKey, e.target.value);
                          }
                        }}
                        className="w-32 px-3 py-1.5 text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded focus:ring-1 focus:ring-gov-blue text-right"
                      />
                      <span className="text-xs text-gray-500 font-medium">Value</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Audit Modal */}
      {auditModalOpen && auditData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-gray-900">AI Verification Audit: {auditData.startup.companyName}</h3>
              </div>
              <button onClick={() => setAuditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              <div className={`p-4 rounded-md border ${auditData.report.isGenuine ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <h4 className={`text-lg font-bold ${auditData.report.isGenuine ? 'text-green-800' : 'text-red-800'} mb-1`}>
                  {auditData.report.isGenuine ? '✅ Startup verified as Genuine (100/100)' : '❌ Verification Failed / Flags Detected'}
                </h4>
                <p className="text-sm text-gray-700">The AI Autonomous Engine has cross-referenced statutory records across DPIIT, MCA, and State Tax Registries.</p>
              </div>

              <div>
                <h5 className="text-sm font-bold text-gray-900 mb-2 border-b pb-1">Validation Checks Passed ({auditData.report.checksPassed?.length || 0})</h5>
                <ul className="space-y-2">
                  {auditData.report.checksPassed?.map((check, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                      <span className="font-bold text-green-500 mt-0.5">✓</span>
                      <span>{check}</span>
                    </li>
                  ))}
                  {(!auditData.report.checksPassed || auditData.report.checksPassed.length === 0) && (
                    <li className="text-sm text-gray-500 italic">No valid checks passed.</li>
                  )}
                </ul>
              </div>

              {auditData.report.warnings?.length > 0 && (
                <div>
                  <h5 className="text-sm font-bold text-red-700 mb-2 border-b border-red-100 pb-1">Critical Warnings ({auditData.report.warnings.length})</h5>
                  <ul className="space-y-2">
                    {auditData.report.warnings.map((warn, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-red-600">
                        <span className="font-bold text-red-500 mt-0.5">⚠</span>
                        <span>{warn}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-4 mt-6 border-t border-gray-100">
              <span className="text-xs text-gray-500 italic">Generated by AgentOrchestratorService via Autonomous AI</span>
              <div className="flex space-x-3">
                <button
                  onClick={() => setAuditModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Close
                </button>
                {auditData.report.isGenuine && auditData.startup.verificationStatus !== 'GovernmentVerified' && (
                  <button
                    onClick={() => {
                      handleToggleStartupVerification(auditData.startup, true);
                      setAuditModalOpen(false);
                    }}
                    className="px-4 py-2 text-xs font-semibold text-white bg-gov-blue rounded-md hover:bg-blue-800"
                  >
                    Officially Approve
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Onboard Department Modal */}
      {showDeptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-gov-blue">Onboard State Department</h3>
              <button onClick={() => setShowDeptModal(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDepartment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Department Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Department of Water Resources & Sanitation"
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gov-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description / Directorate Scope</label>
                <textarea
                  rows={3}
                  placeholder="Describe operational responsibilities and civic innovation mandate..."
                  value={newDeptDesc}
                  onChange={(e) => setNewDeptDesc(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gov-blue"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowDeptModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={deptSubmitting || !newDeptName.trim()}
                  className="px-4 py-2 text-xs font-semibold text-white bg-gov-blue rounded-md hover:bg-blue-800 disabled:opacity-50"
                >
                  {deptSubmitting ? 'Onboarding...' : 'Onboard Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

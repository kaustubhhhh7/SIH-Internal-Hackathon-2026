import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe, User, LogOut, Bell, FileText, Settings, Activity, ShoppingBag, FlaskConical, PlusCircle, Building, CheckCircle } from 'lucide-react';

const MainLayout = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // User details
  const userRole = localStorage.getItem('userRole') || 'STARTUP';
  const userName = localStorage.getItem('userName') || (userRole === 'GOVERNMENT_DEPARTMENT' ? 'Department of Transport' : 'Demo User');

  const toggleLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('appLanguage', lang);
    setIsLangMenuOpen(false);
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userDepartment');
    localStorage.removeItem('startupProfile');
    setShowLogoutConfirm(false);
    navigate('/login');
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const isMr = i18n.language === 'mr';

  // Role display name in current language
  const getRoleDisplayName = (role: string) => {
    if (!isMr) {
      switch (role) {
        case 'ADMINISTRATOR': return 'System Administrator';
        case 'GOVERNMENT_DEPARTMENT': return 'Government Department';
        case 'STARTUP': return 'Startup Innovator';
        case 'PROCUREMENT_OFFICER': return 'Procurement Officer';
        case 'INDEPENDENT_VALIDATOR': return 'Independent Validator';
        case 'EXPERT_EVALUATOR': return 'Expert Evaluator';
        default: return role;
      }
    }
    switch (role) {
      case 'ADMINISTRATOR': return '🛡️ प्रणाली प्रशासक';
      case 'GOVERNMENT_DEPARTMENT': return '🏛️ शासकीय विभाग';
      case 'STARTUP': return '🚀 स्टार्टअप संस्था';
      case 'PROCUREMENT_OFFICER': return '📑 खरेदी अधिकारी';
      case 'INDEPENDENT_VALIDATOR': return '⚖️ स्वतंत्र प्रमाणीकरणकर्ता';
      case 'EXPERT_EVALUATOR': return '🔬 तज्ज्ञ मूल्यमापक';
      default: return role;
    }
  };

  // Role-based navigation
  const getNavItems = () => {
    switch (userRole) {
      case 'STARTUP':
        return [
          { name: isMr ? 'डॅशबोर्ड' : 'Dashboard', path: '/startup/dashboard', icon: <Activity className="w-5 h-5 mr-3" /> },
          { name: isMr ? 'उत्पादन नोंदवा (रनवे)' : 'List Product (Runway)', path: '/startup/products/add', icon: <PlusCircle className="w-5 h-5 mr-3" /> },
          { name: isMr ? 'उत्पादने प्रदर्शन' : 'Products Showcase', path: '/startup/showcase', icon: <ShoppingBag className="w-5 h-5 mr-3" /> },
          { name: isMr ? 'आव्हाने शोधा' : 'Find Challenges', path: '/startup/challenges', icon: <FileText className="w-5 h-5 mr-3" /> },
          { name: isMr ? 'माझे अर्ज' : 'My Applications', path: '/startup/applications', icon: <FileText className="w-5 h-5 mr-3" /> },
        ];
      case 'GOVERNMENT_DEPARTMENT':
        return [
          { name: isMr ? 'डॅशबोर्ड' : 'Dashboard', path: '/gov/dashboard', icon: <Activity className="w-5 h-5 mr-3" /> },
          { name: isMr ? 'नाविन्यपूर्ण प्रदर्शन' : 'Innovation Showcase', path: '/gov/showcase', icon: <ShoppingBag className="w-5 h-5 mr-3" /> },
          { name: isMr ? 'सक्रिय सँडबॉक्स चाचण्या' : 'Field Sandbox Trials', path: '/gov/sandbox-trials', icon: <FlaskConical className="w-5 h-5 mr-3" /> },
          { name: isMr ? 'माझी आव्हाने' : 'My Challenges', path: '/gov/challenges', icon: <FileText className="w-5 h-5 mr-3" /> },
        ];
      case 'ADMINISTRATOR':
        return [
          { name: isMr ? 'डॅशबोर्ड' : 'Dashboard', path: '/admin/dashboard', icon: <Activity className="w-5 h-5 mr-3" /> },
          { name: isMr ? 'वापरकर्ते आणि भूमिका' : 'Users & Roles', path: '/admin/users', icon: <User className="w-5 h-5 mr-3" /> },
          { name: isMr ? 'शासकीय विभाग' : 'Departments', path: '/admin/departments', icon: <Building className="w-5 h-5 mr-3" /> },
          { name: isMr ? 'स्टार्टअप पडताळणी' : 'Startup Verification', path: '/admin/startups', icon: <CheckCircle className="w-5 h-5 mr-3" /> },
          { name: isMr ? 'ज्ञान केंद्र (Knowledge Base)' : 'Knowledge Base', path: '/admin/knowledge', icon: <FileText className="w-5 h-5 mr-3" /> },
          { name: isMr ? 'सँडबॉक्स नोंदवही' : 'Sandbox Register', path: '/gov/sandbox-trials', icon: <FlaskConical className="w-5 h-5 mr-3" /> },
          { name: isMr ? 'नाविन्यपूर्ण प्रदर्शन' : 'Innovation Showcase', path: '/admin/showcase', icon: <ShoppingBag className="w-5 h-5 mr-3" /> },
          { name: isMr ? 'प्रणाली सेटिंग्ज' : 'System Settings', path: '/admin/settings', icon: <Settings className="w-5 h-5 mr-3" /> },
        ];
      case 'PROCUREMENT_OFFICER':
        return [
          { name: isMr ? 'डॅशबोर्ड' : 'Dashboard', path: '/procurement/dashboard', icon: <Activity className="w-5 h-5 mr-3" /> },
          { name: isMr ? 'नाविन्यपूर्ण प्रदर्शन' : 'Innovation Showcase', path: '/procurement/showcase', icon: <ShoppingBag className="w-5 h-5 mr-3" /> },
          { name: isMr ? 'थेट खरेदी आदेश' : 'Direct Purchase Orders', path: '/procurement/issue-po', icon: <FileText className="w-5 h-5 mr-3" /> },
          { name: isMr ? 'सँडबॉक्स मूल्यमापन' : 'Sandbox Evaluations', path: '/gov/sandbox-trials', icon: <FlaskConical className="w-5 h-5 mr-3" /> },
        ];
      case 'INDEPENDENT_VALIDATOR':
        return [
          { name: isMr ? 'डॅशबोर्ड' : 'Dashboard', path: '/validator/dashboard', icon: <Activity className="w-5 h-5 mr-3" /> },
          { name: isMr ? 'सँडबॉक्स प्रमाणीकरण' : 'Sandbox Validation', path: '/gov/sandbox-trials', icon: <FlaskConical className="w-5 h-5 mr-3" /> },
          { name: isMr ? 'उत्पादन सूची' : 'Product Catalogue', path: '/validator/showcase', icon: <ShoppingBag className="w-5 h-5 mr-3" /> },
        ];
      case 'EXPERT_EVALUATOR':
      default:
        return [
          { name: isMr ? 'डॅशबोर्ड' : 'Dashboard', path: `/${userRole.toLowerCase().split('_')[0]}/dashboard`, icon: <Activity className="w-5 h-5 mr-3" /> },
          { name: isMr ? 'उत्पादन प्रदर्शन' : 'Product Showcase', path: '/expert/showcase', icon: <ShoppingBag className="w-5 h-5 mr-3" /> },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="flex h-screen bg-gov-gray">
      {/* Sidebar for Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gov-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gov-border bg-gov-blue text-white">
          <span className="text-sm font-semibold tracking-wide uppercase truncate">
            {isMr ? 'महाराष्ट्र शासन' : 'Gov of Maharashtra'}
          </span>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex flex-col h-[calc(100vh-4rem)]">
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-2 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-gov-blue font-bold'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className={isActive ? 'text-gov-blue' : 'text-gray-400'}>{item.icon}</span>
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="p-4 border-t border-gov-border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gov-blueLight flex items-center justify-center text-white font-bold">
                  {userName.charAt(0)}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{userName}</p>
                <p className="text-xs font-medium text-gray-500">{getRoleDisplayName(userRole)}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="mt-4 flex w-full items-center px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 cursor-pointer"
            >
              <LogOut className="w-5 h-5 mr-3 text-red-500" />
              {isMr ? 'लॉगआउट करा' : 'Logout'}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gov-border h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <button onClick={() => setIsSidebarOpen(true)} className="text-gray-500 focus:outline-none lg:hidden mr-4">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-gov-blue truncate hidden sm:block">
              {isMr ? 'महाराष्ट्र शासन नाविन्यपूर्ण खरेदी पोर्टल' : 'Innovation Procurement Portal'}
            </h1>
            <h1 className="text-xl font-bold text-gov-blue sm:hidden">IPP</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gov-blue p-1">
              <Bell className="w-5 h-5" />
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center text-gray-700 hover:text-gov-blue p-1.5 focus:outline-none bg-slate-100 hover:bg-slate-200 rounded-md border border-slate-300 transition-colors"
              >
                <Globe className="w-4 h-4 mr-1 text-gov-blue" />
                <span className="text-xs font-extrabold uppercase tracking-wider">{i18n.language}</span>
              </button>
              
              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-xl py-1 border border-gray-200 z-50 animate-fadeIn">
                  <button
                    onClick={() => toggleLanguage('en')}
                    className={`flex items-center justify-between w-full text-left px-4 py-2 text-sm ${i18n.language === 'en' ? 'bg-blue-50 text-gov-blue font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    <span>English</span>
                    {i18n.language === 'en' && <span className="text-xs text-gov-blue">✓</span>}
                  </button>
                  <button
                    onClick={() => toggleLanguage('mr')}
                    className={`flex items-center justify-between w-full text-left px-4 py-2 text-sm ${i18n.language === 'mr' ? 'bg-blue-50 text-gov-blue font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    <span>मराठी (MR)</span>
                    {i18n.language === 'mr' && <span className="text-xs text-gov-blue">✓</span>}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gov-gray p-4 sm:p-6 lg:p-8 relative">
          <Outlet />

          {/* Logout Confirmation Modal */}
          {showLogoutConfirm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-sm w-full overflow-hidden animate-fadeIn">
                <div className="p-6">
                  <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4 mx-auto">
                    <LogOut className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-center text-gray-900 mb-2">
                    {isMr ? 'लॉगआउट पुष्टीकरण' : 'Confirm Logout'}
                  </h3>
                  <p className="text-sm text-center text-gray-600 mb-6">
                    {isMr ? 'तुम्हाला नक्की लॉगआउट करायचे आहे का?' : 'Are you sure you want to log out of your account?'}
                  </p>
                  <div className="flex gap-3">
                    <button 
                      onClick={cancelLogout}
                      className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm font-medium transition-colors"
                    >
                      {isMr ? 'रद्द करा' : 'Cancel'}
                    </button>
                    <button 
                      onClick={confirmLogout}
                      className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors"
                    >
                      {isMr ? 'लॉगआउट' : 'Logout'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

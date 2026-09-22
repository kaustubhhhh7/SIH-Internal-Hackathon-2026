import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe, User, LogOut, Bell, FileText, Settings, Activity, ShoppingBag, FlaskConical, PlusCircle } from 'lucide-react';

const MainLayout = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  // User details
  const userRole = localStorage.getItem('userRole') || 'STARTUP';
  const userName = localStorage.getItem('userName') || (userRole === 'GOVERNMENT_DEPARTMENT' ? 'Department of Transport' : 'Demo User');

  const toggleLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('appLanguage', lang);
    setIsLangMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userDepartment');
    localStorage.removeItem('startupProfile');
    navigate('/login');
  };

  // Role-based navigation
  const getNavItems = () => {
    switch (userRole) {
      case 'STARTUP':
        return [
          { name: 'Dashboard', path: '/startup/dashboard', icon: <Activity className="w-5 h-5 mr-3" /> },
          { name: 'List Product (Runway)', path: '/startup/products/add', icon: <PlusCircle className="w-5 h-5 mr-3" /> },
          { name: 'Products Showcase', path: '/showcase', icon: <ShoppingBag className="w-5 h-5 mr-3" /> },
          { name: 'Find Challenges', path: '/startup/challenges', icon: <FileText className="w-5 h-5 mr-3" /> },
          { name: 'My Applications', path: '/startup/applications', icon: <FileText className="w-5 h-5 mr-3" /> },
        ];
      case 'GOVERNMENT_DEPARTMENT':
        return [
          { name: 'Dashboard', path: '/gov/dashboard', icon: <Activity className="w-5 h-5 mr-3" /> },
          { name: 'Startup Showcase', path: '/showcase', icon: <ShoppingBag className="w-5 h-5 mr-3" /> },
          { name: 'Field Sandbox Trials', path: '/gov/sandbox-trials', icon: <FlaskConical className="w-5 h-5 mr-3" /> },
          { name: 'My Challenges', path: '/gov/challenges', icon: <FileText className="w-5 h-5 mr-3" /> },
        ];
      case 'ADMINISTRATOR':
        return [
          { name: 'Dashboard', path: '/admin/dashboard', icon: <Activity className="w-5 h-5 mr-3" /> },
          { name: 'Innovation Showcase', path: '/showcase', icon: <ShoppingBag className="w-5 h-5 mr-3" /> },
          { name: 'Sandbox Register', path: '/gov/sandbox-trials', icon: <FlaskConical className="w-5 h-5 mr-3" /> },
          { name: 'Users & Roles', path: '/admin/users', icon: <User className="w-5 h-5 mr-3" /> },
          { name: 'System Settings', path: '/admin/settings', icon: <Settings className="w-5 h-5 mr-3" /> },
        ];
      case 'PROCUREMENT_OFFICER':
        return [
          { name: 'Dashboard', path: '/procurement/dashboard', icon: <Activity className="w-5 h-5 mr-3" /> },
          { name: 'Startup Showcase', path: '/showcase', icon: <ShoppingBag className="w-5 h-5 mr-3" /> },
          { name: 'Direct Purchase Orders', path: '/procurement/issue-po', icon: <FileText className="w-5 h-5 mr-3" /> },
          { name: 'Sandbox Evaluations', path: '/gov/sandbox-trials', icon: <FlaskConical className="w-5 h-5 mr-3" /> },
        ];
      case 'INDEPENDENT_VALIDATOR':
        return [
          { name: 'Dashboard', path: '/validator/dashboard', icon: <Activity className="w-5 h-5 mr-3" /> },
          { name: 'Sandbox Validation', path: '/gov/sandbox-trials', icon: <FlaskConical className="w-5 h-5 mr-3" /> },
          { name: 'Product Catalogue', path: '/showcase', icon: <ShoppingBag className="w-5 h-5 mr-3" /> },
        ];
      case 'EXPERT_EVALUATOR':
      default:
        return [
          { name: 'Dashboard', path: `/${userRole.toLowerCase().split('_')[0]}/dashboard`, icon: <Activity className="w-5 h-5 mr-3" /> },
          { name: 'Product Showcase', path: '/showcase', icon: <ShoppingBag className="w-5 h-5 mr-3" /> },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="flex h-screen bg-gov-gray">
      {/* Sidebar for Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gov-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gov-border bg-gov-blue text-white">
          <span className="text-sm font-semibold tracking-wide uppercase truncate">Gov of Maharashtra</span>
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
                        ? 'bg-blue-50 text-gov-blue'
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
                <p className="text-xs font-medium text-gray-500">{userRole}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="mt-4 flex w-full items-center px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50"
            >
              <LogOut className="w-5 h-5 mr-3 text-red-500" />
              {t('common.logout')}
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
            <h1 className="text-xl font-bold text-gov-blue truncate hidden sm:block">Innovation Procurement Portal</h1>
            <h1 className="text-xl font-bold text-gov-blue sm:hidden">IPP</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gov-blue p-1">
              <Bell className="w-5 h-5" />
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center text-gray-500 hover:text-gov-blue p-1 focus:outline-none"
              >
                <Globe className="w-5 h-5 mr-1" />
                <span className="text-sm font-medium uppercase">{i18n.language}</span>
              </button>
              
              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-50">
                  <button
                    onClick={() => toggleLanguage('en')}
                    className={`block w-full text-left px-4 py-2 text-sm ${i18n.language === 'en' ? 'bg-gray-100 text-gov-blue font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => toggleLanguage('mr')}
                    className={`block w-full text-left px-4 py-2 text-sm ${i18n.language === 'mr' ? 'bg-gray-100 text-gov-blue font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    मराठी
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gov-gray p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

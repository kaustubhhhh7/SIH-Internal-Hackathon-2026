import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, LogIn, ChevronDown, Search, Menu, X, Globe, Sparkles } from 'lucide-react';
import Chatbot from '../components/ui/Chatbot';
import emblemLogo from '../assets/images/Emblem_of_India_(Government_Gazette).svg.webp';

const PublicLayout = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Use native browser find (like Ctrl+F)
      const query = searchQuery.trim();
      const win = window as any;
      if (typeof win.find === 'function') {
        const found = win.find(query);
        if (!found) {
          window.getSelection()?.removeAllRanges();
          window.scrollTo(0, 0);
          win.find(query);
        }
      }
    }
  };
  
  // High Contrast State
  const [isHighContrast, setIsHighContrast] = useState(false);
  
  const toggleHighContrast = () => {
    setIsHighContrast(!isHighContrast);
  };
  
  useEffect(() => {
    if (isHighContrast) {
      document.documentElement.classList.add('theme-high-contrast');
    } else {
      document.documentElement.classList.remove('theme-high-contrast');
    }
  }, [isHighContrast]);

  // Font Size State
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'small'>('normal');
  
  useEffect(() => {
    if (fontSize === 'small') {
      document.documentElement.style.fontSize = '14px';
    } else if (fontSize === 'large') {
      document.documentElement.style.fontSize = '18px';
    } else {
      document.documentElement.style.fontSize = '16px'; 
    }
  }, [fontSize]);

  // Language State
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('appLanguage', lng);
    setLangDropdownOpen(false);
  };

  const navLinkClass = (path: string) => {
    return `hover:text-blue-800 hover:underline underline-offset-4 transition-colors ${location.pathname === path ? 'text-blue-800 underline font-bold' : 'text-gray-800'}`;
  };

  return (
    <div className={`bg-gray-50 flex flex-col font-sans min-w-0 ${location.pathname === '/login' ? 'min-h-screen' : 'min-h-screen'}`}>
      
      {/* 0. SKIP TO MAIN CONTENT ACCESSIBILITY LINK */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-white focus:text-blue-800">
        {i18n.language === 'mr' ? 'मुख्य सामग्रीवर जा' : 'Skip to Main Content'}
      </a>

      {/* 1. TOP UTILITY BAR */}
      <div className="bg-white border-b border-gray-300 text-caption py-1.5 px-3 sm:px-6 lg:px-12 xl:px-20 flex justify-between items-center text-gray-700 relative z-50">
        <div className="hidden sm:flex items-center space-x-3 font-medium min-w-0">
          <span className="mr-2 truncate">{t('landing.topbar.fullTitle')}</span>
          <Link to="/raise-ticket" className="hover:bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded-xs border border-blue-200 bg-white shadow-xs transition-colors shrink-0 flex items-center">
            {i18n.language === 'mr' ? 'तक्रार नोंदवा' : 'Raise a Ticket'}
          </Link>
          <a 
            href="#main-content" 
            onClick={(e) => {
              if (location.pathname === '/') {
                e.preventDefault();
                document.getElementById('status-section')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="hover:bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-xs border border-gray-200 bg-white shadow-xs transition-colors shrink-0 hidden md:flex items-center"
          >
            {i18n.language === 'mr' ? 'मुख्य सामग्रीवर जा' : 'Skip to Main Content'}
          </a>
        </div>
        <div className="sm:hidden flex items-center space-x-2 font-medium min-w-0">
          <span className="truncate">{t('landing.topbar.shortTitle')}</span>
          <Link to="/raise-ticket" className="hover:bg-blue-50 text-blue-800 px-2 py-0.5 rounded-xs border border-blue-200 bg-white shadow-xs transition-colors text-[10px] shrink-0">
            {i18n.language === 'mr' ? 'तक्रार' : 'Ticket'}
          </Link>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          <button 
            onClick={toggleHighContrast}
            className={`hidden md:inline hover:underline cursor-pointer focus:outline-none text-xs ${isHighContrast ? 'font-bold text-blue-800' : ''}`}
          >
            {t('landing.topbar.highContrast')}
          </button>
          
          <div className="hidden md:flex space-x-1 border-l border-r border-gray-300 px-2 sm:px-3 mx-1">
            <button 
              onClick={() => setFontSize('small')}
              className={`hover:bg-gray-200 px-1.5 py-0.5 rounded-xs focus:outline-none ${fontSize === 'small' ? 'bg-gray-200 font-bold' : ''}`}
              title="Small font size"
            >
              A-
            </button>
            <button 
              onClick={() => setFontSize('normal')}
              className={`hover:bg-gray-200 px-1.5 py-0.5 rounded-xs font-medium focus:outline-none ${fontSize === 'normal' ? 'bg-gray-200 font-bold' : ''}`}
              title="Normal font size"
            >
              A
            </button>
            <button 
              onClick={() => setFontSize('large')}
              className={`hover:bg-gray-200 px-1.5 py-0.5 rounded-xs font-bold focus:outline-none ${fontSize === 'large' ? 'bg-gray-200' : ''}`}
              title="Large font size"
            >
              A+
            </button>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center cursor-pointer hover:bg-gray-100 px-2 py-0.5 rounded-xs focus:outline-none border border-transparent hover:border-gray-300 text-xs font-semibold"
              aria-label="Select language"
            >
              {i18n.language === 'mr' ? 'मराठी' : 'English'} <ChevronDown className="ml-1 h-3 w-3" />
            </button>
            
            {langDropdownOpen && (
              <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-300 shadow-md rounded-xs overflow-hidden z-50 animate-fadeIn">
                <button 
                  onClick={() => changeLanguage('en')}
                  className={`block w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 ${i18n.language === 'en' ? 'bg-gray-100 font-bold text-blue-800' : ''}`}
                >
                  English
                </button>
                <button 
                  onClick={() => changeLanguage('mr')}
                  className={`block w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 ${i18n.language === 'mr' ? 'bg-gray-100 font-bold text-blue-800' : ''}`}
                >
                  मराठी
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER */}
      <header className="bg-white border-b border-gray-300 py-2 sm:py-3 sticky top-0 z-40 shadow-xs w-full">
        <div className="w-full px-3 sm:px-6 lg:px-12 xl:px-20">
          <div className="flex items-center justify-between gap-2">
            
            {/* Logo area */}
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 lg:border-r lg:border-gray-300 lg:pr-6 shrink-0 hover:opacity-90 transition-opacity min-w-0">
              <img src={emblemLogo} alt="Emblem" className="h-10 sm:h-12 md:h-14 w-auto object-contain shrink-0" />
              <div className="flex flex-col justify-center min-w-0">
                <span className="text-sm sm:text-base md:text-lg lg:text-section-title leading-tight font-bold text-gray-900 truncate">
                  {t('landing.header.portalTitle')}
                </span>
                <span className="text-[10px] sm:text-xs leading-none mt-0.5 text-gray-500 font-medium truncate">
                  {t('landing.header.govTitle')}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex flex-1 items-center justify-start space-x-4 xl:space-x-7 pl-6 xl:pl-10 text-xs xl:text-[13px] font-semibold tracking-wide uppercase">
              <Link to="/" className={navLinkClass('/')}>{t('landing.header.nav.home')}</Link>
              <Link to="/runway" className={`flex items-center gap-1.5 ${navLinkClass('/runway')}`}>
                <span>{i18n.language === 'mr' ? 'स्टार्टअप रनवे' : 'Startup Runway'}</span>
                <span className="text-[10px] font-bold bg-amber-400 text-slate-900 px-1.5 py-0.2 rounded-xs shadow-2xs">GeM</span>
              </Link>
              <Link to="/showcase" className={navLinkClass('/showcase')}>
                {i18n.language === 'mr' ? 'उत्पादने प्रदर्शन' : 'Products Showcase'}
              </Link>
              <Link to="/challenges" className={navLinkClass('/challenges')}>{t('landing.header.nav.challenges')}</Link>
              <Link to="/sectors" className={navLinkClass('/sectors')}>{t('landing.header.nav.sectors')}</Link>
              <Link to="/process" className={navLinkClass('/process')}>{t('landing.header.nav.process')}</Link>
            </nav>

            {/* Right side: Search, Sign In, Register & Mobile Toggle */}
            <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
              <form onSubmit={handleSearch} className="hidden xl:block relative">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={i18n.language === 'mr' ? 'काहीतरी शोधत आहात?' : 'Looking for something?'} 
                  className="w-44 xl:w-56 pl-3 pr-8 py-1 h-8 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs transition-all bg-gray-50/50 hover:bg-white focus:bg-white"
                />
                <button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-800" aria-label="Search">
                  <Search className="w-3.5 h-3.5" />
                </button>
              </form>

              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login">
                  <button className="flex items-center justify-center font-semibold text-slate-700 hover:text-blue-900 border border-slate-300 hover:border-blue-900 bg-white hover:bg-blue-50/50 px-3 sm:px-4 h-8 rounded-md text-xs transition-all shadow-2xs hover:shadow-xs whitespace-nowrap tracking-wider uppercase cursor-pointer">
                    {t('common.login')}
                  </button>
                </Link>
                <Link to="/register/startup">
                  <button className="flex items-center justify-center gap-1 font-bold text-white bg-gradient-to-r from-[#0c2340] to-[#143763] hover:from-[#143763] hover:to-[#1a467e] border border-[#0c2340] px-3 sm:px-4 h-8 rounded-md text-xs transition-all shadow-xs hover:shadow-sm whitespace-nowrap tracking-wider uppercase cursor-pointer">
                    <span>{t('common.register')}</span>
                    <LogIn className="h-3.5 w-3.5 stroke-[2.2]" />
                  </button>
                </Link>
              </div>

              {/* Hamburger Button for Mobile/Tablet */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-1.5 rounded-md text-gray-700 hover:text-blue-800 hover:bg-gray-100 focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer / Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white shadow-lg animate-fadeIn">
            <div className="px-4 py-3 space-y-3">
              <form onSubmit={handleSearch} className="relative">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={i18n.language === 'mr' ? 'काहीतरी शोधत आहात?' : 'Looking for something?'} 
                  className="w-full pl-3.5 pr-9 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-blue-800"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-800">
                  <Search className="w-4 h-4" />
                </button>
              </form>

              <nav className="flex flex-col space-y-2 pt-2 border-t border-gray-100 font-semibold text-sm">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="py-1.5 px-2 rounded-md hover:bg-blue-50 text-gray-800">
                  {t('landing.header.nav.home')}
                </Link>
                <Link to="/runway" onClick={() => setIsMobileMenuOpen(false)} className="py-1.5 px-2 rounded-md hover:bg-blue-50 text-gray-800 flex items-center justify-between">
                  <span>{i18n.language === 'mr' ? 'स्टार्टअप रनवे' : 'Startup Runway'}</span>
                  <span className="text-[10px] font-bold bg-amber-400 text-slate-900 px-1.5 py-0.5 rounded-xs">GeM</span>
                </Link>
                <Link to="/showcase" onClick={() => setIsMobileMenuOpen(false)} className="py-1.5 px-2 rounded-md hover:bg-blue-50 text-gray-800">
                  {i18n.language === 'mr' ? 'उत्पादने प्रदर्शन' : 'Products Showcase'}
                </Link>
                <Link to="/challenges" onClick={() => setIsMobileMenuOpen(false)} className="py-1.5 px-2 rounded-md hover:bg-blue-50 text-gray-800">
                  {t('landing.header.nav.challenges')}
                </Link>
                <Link to="/sectors" onClick={() => setIsMobileMenuOpen(false)} className="py-1.5 px-2 rounded-md hover:bg-blue-50 text-gray-800">
                  {t('landing.header.nav.sectors')}
                </Link>
                <Link to="/process" onClick={() => setIsMobileMenuOpen(false)} className="py-1.5 px-2 rounded-md hover:bg-blue-50 text-gray-800">
                  {t('landing.header.nav.process')}
                </Link>
              </nav>

              <div className="pt-3 border-t border-gray-100 flex flex-col sm:hidden gap-2">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="w-full text-center font-semibold text-slate-800 border border-slate-300 bg-white py-2 rounded-md text-sm uppercase">
                    {t('common.login')}
                  </button>
                </Link>
                <Link to="/register/startup" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="w-full flex items-center justify-center gap-1.5 font-bold text-white bg-blue-900 py-2 rounded-md text-sm uppercase">
                    <span>{t('common.register')}</span>
                    <LogIn className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* 3. SCROLLING ANNOUNCEMENT TICKER */}
      <div className="bg-gray-100 border-b border-gray-300 py-1 text-xs text-gray-800 overflow-hidden flex whitespace-nowrap items-center">
        <div className="px-3 sm:px-4 text-[11px] sm:text-xs font-bold text-red-700 border-r border-gray-300 mr-2 shrink-0">
          {t('landing.marquee.title')}
        </div>
        {React.createElement('marquee', { className: 'flex-1', scrollamount: '5' },
          <>
            <span className="mx-6 sm:mx-8 font-semibold text-gray-900">{t('landing.marquee.m1')}</span>
            <span className="mx-6 sm:mx-8 text-gray-700">{t('landing.marquee.m2')}</span>
            <span className="mx-6 sm:mx-8 text-gray-700">{t('landing.marquee.m3')}</span>
          </>
        )}
      </div>

      <main id="main-content" className="w-full bg-white flex flex-col flex-1 scroll-mt-20 min-w-0">
        {/* Child Routes injected here */}
        <Outlet />
      </main>

      {/* 9. EXPANDED FOOTER (hidden on /login) */}
      {location.pathname !== '/login' && (
        <footer className="bg-[#1a1a1a] text-white pt-10 sm:pt-12 pb-8 border-t-4 border-blue-800 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
              <div className="col-span-1 sm:col-span-2 lg:col-span-2">
                <div className="flex items-center space-x-3 sm:space-x-4 mb-4 border-b border-gray-700 pb-4 pr-4 sm:pr-12 w-fit">
                  <img src={emblemLogo} alt="Emblem" className="h-10 w-auto object-contain bg-white rounded-full p-1 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-caption text-gray-400">{t('landing.header.govTitle')}</span>
                    <span className="text-base sm:text-card-title text-white font-bold">{t('landing.header.portalTitle')}</span>
                  </div>
                </div>
                <p className="text-gray-400 text-xs sm:text-sm max-w-md mb-6 leading-relaxed">
                  {t('landing.footer.desc')}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-bold text-gray-200 uppercase tracking-wider mb-3 sm:mb-4">{t('landing.footer.quickLinks')}</h4>
                <ul className="space-y-2.5 text-xs sm:text-sm text-gray-400">
                  <li><Link to="/process" className="hover:text-white transition-colors underline underline-offset-2">{t('landing.footer.links.about')}</Link></li>
                  <li><Link to="/register/startup" className="hover:text-white transition-colors underline underline-offset-2">{t('landing.footer.links.registration')}</Link></li>
                  <li><a href="#" className="hover:text-white transition-colors underline underline-offset-2">{t('landing.footer.links.faq')}</a></li>
                  <li><Link to="/process" className="hover:text-white transition-colors underline underline-offset-2">{t('landing.footer.links.policy')}</Link></li>
                  <li><a href="#" className="hover:text-white transition-colors underline underline-offset-2">{t('landing.footer.links.rti')}</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-bold text-gray-200 uppercase tracking-wider mb-3 sm:mb-4">{t('landing.footer.contact')}</h4>
                <ul className="space-y-2.5 text-xs sm:text-sm text-gray-400">
                  <li className="leading-relaxed">
                    <strong className="text-gray-300">{t('landing.footer.office')}</strong><br/>
                    {t('landing.footer.address')}
                  </li>
                  <li className="break-all sm:break-normal">
                    <strong className="text-gray-300">{t('landing.footer.email')}</strong> support@innovation.maharashtra.gov.in
                  </li>
                  <li>
                    <strong className="text-gray-300">{t('landing.footer.phone')}</strong> 1800-XXX-XXXX
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 gap-4 text-center md:text-left">
              <div>
                {t('landing.footer.copyright')}
              </div>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                <a href="#" className="hover:text-white transition-colors">{t('landing.footer.privacy')}</a>
                <a href="#" className="hover:text-white transition-colors">{t('landing.footer.terms')}</a>
                <a href="#" className="hover:text-white transition-colors">{t('landing.footer.accessibility')}</a>
              </div>
            </div>
          </div>
        </footer>
      )}

      {/* Floating Chatbot */}
      <Chatbot />
    </div>
  );
};

export default PublicLayout;

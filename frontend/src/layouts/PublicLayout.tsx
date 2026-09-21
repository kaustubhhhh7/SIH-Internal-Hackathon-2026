import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, LogIn, ChevronDown, Search } from 'lucide-react';
import Chatbot from '../components/ui/Chatbot';
import emblemLogo from '../assets/images/Emblem_of_India_(Government_Gazette).svg.webp';

const PublicLayout = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Use native browser find (like Ctrl+F)
      const query = searchQuery.trim();
      const found = window.find(query);
      
      // If not found, try wrapping around from the top
      if (!found) {
        window.getSelection()?.removeAllRanges();
        window.scrollTo(0, 0);
        window.find(query);
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
    return `hover:text-blue-800 hover:underline underline-offset-4 ${location.pathname === path ? 'text-blue-800 underline' : 'text-gray-800'}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* 0. SKIP TO MAIN CONTENT ACCESSIBILITY LINK */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-white focus:text-blue-800">
        Skip to Main Content
      </a>

      {/* 1. TOP UTILITY BAR */}
      <div className="bg-white border-b border-gray-300 text-caption py-1 px-4 sm:px-6 lg:px-8 flex justify-between items-center text-gray-700 relative z-50">
        <div className="hidden sm:flex items-center space-x-3 font-medium">
          <span className="mr-2">{t('landing.topbar.fullTitle')}</span>
          <Link to="/raise-ticket" className="hover:bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded-sm border border-blue-200 bg-white shadow-sm transition-colors flex items-center">
            Raise a Ticket
          </Link>
          <a 
            href="#main-content" 
            onClick={(e) => {
              if (location.pathname === '/') {
                e.preventDefault();
                document.getElementById('status-section')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="hover:bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-sm border border-gray-200 bg-white shadow-sm transition-colors flex items-center"
          >
            Skip to Main Content
          </a>
        </div>
        <div className="sm:hidden flex items-center space-x-2 font-medium">
          <span className="mr-2">{t('landing.topbar.shortTitle')}</span>
          <Link to="/raise-ticket" className="hover:bg-blue-50 text-blue-800 px-2 py-0.5 rounded-sm border border-blue-200 bg-white shadow-sm transition-colors text-[10px]">
            Ticket
          </Link>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button 
            onClick={toggleHighContrast}
            className={`hidden md:inline hover:underline cursor-pointer focus:outline-none ${isHighContrast ? 'font-bold text-blue-800' : ''}`}
          >
            {t('landing.topbar.highContrast')}
          </button>
          
          <div className="hidden md:flex space-x-1 border-l border-r border-gray-300 px-4 mx-2">
            <button 
              onClick={() => setFontSize('small')}
              className={`hover:bg-gray-200 px-2 py-0.5 rounded-sm focus:outline-none ${fontSize === 'small' ? 'bg-gray-200 font-bold' : ''}`}
            >
              A-
            </button>
            <button 
              onClick={() => setFontSize('normal')}
              className={`hover:bg-gray-200 px-2 py-0.5 rounded-sm font-medium focus:outline-none ${fontSize === 'normal' ? 'bg-gray-200 font-bold' : ''}`}
            >
              A
            </button>
            <button 
              onClick={() => setFontSize('large')}
              className={`hover:bg-gray-200 px-2 py-0.5 rounded-sm font-bold focus:outline-none ${fontSize === 'large' ? 'bg-gray-200' : ''}`}
            >
              A+
            </button>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-sm focus:outline-none border border-transparent hover:border-gray-300"
            >
              {i18n.language === 'mr' ? 'मराठी' : 'English'} <ChevronDown className="ml-1 h-3 w-3" />
            </button>
            
            {langDropdownOpen && (
              <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-300 shadow-sm rounded-none overflow-hidden">
                <button 
                  onClick={() => changeLanguage('en')}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 transition-none ${i18n.language === 'en' ? 'bg-gray-100 font-bold text-blue-800' : ''}`}
                >
                  English
                </button>
                <button 
                  onClick={() => changeLanguage('mr')}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 transition-none ${i18n.language === 'mr' ? 'bg-gray-100 font-bold text-blue-800' : ''}`}
                >
                  मराठी
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER */}
      <header className="bg-white border-b border-gray-300 py-3 sticky top-0 z-40 shadow-xs w-full">
        <div className="w-full px-10 sm:px-14 lg:px-24">
          <div className="flex items-center justify-between">
            {/* Logo area */}
            <Link to="/" className="flex items-center space-x-3 border-r border-gray-300 pr-6 lg:pr-8 shrink-0 hover:opacity-90 transition-opacity">
              <img src={emblemLogo} alt="Emblem" className="h-12 sm:h-14 w-auto object-contain" />
              <div className="flex flex-col justify-center">
                <span className="text-section-title leading-none font-bold text-gray-900">{t('landing.header.portalTitle')}</span>
                <span className="text-caption leading-none mt-1 text-gray-500 font-medium">{t('landing.header.govTitle')}</span>
              </div>
            </Link>

            {/* Navigation Links - Pushed Left Uppercase */}
            <nav className="hidden lg:flex flex-1 items-center justify-start space-x-5 xl:space-x-8 pl-6 lg:pl-10 text-xs lg:text-[13px] font-semibold tracking-wide uppercase">
              <Link to="/" className={navLinkClass('/')}>{t('landing.header.nav.home')}</Link>
              <Link to="/challenges" className={navLinkClass('/challenges')}>{t('landing.header.nav.challenges')}</Link>
              <Link to="/sectors" className={navLinkClass('/sectors')}>{t('landing.header.nav.sectors')}</Link>
              <Link to="/process" className={navLinkClass('/process')}>{t('landing.header.nav.process')}</Link>
            </nav>

            {/* Right side: Search & Sign In Button */}
            <div className="flex items-center space-x-3 sm:space-x-4 shrink-0">
              <form onSubmit={handleSearch} className="hidden md:block relative">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Looking for something?" 
                  className="w-48 lg:w-64 pl-3.5 pr-8 py-1 h-8 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs transition-all bg-gray-50/50 hover:bg-white focus:bg-white"
                />
                <button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-800">
                  <Search className="w-3.5 h-3.5" />
                </button>
              </form>

              <div className="flex items-center gap-2">
                <Link to="/login">
                  <button className="flex items-center justify-center font-semibold text-gray-700 border border-gray-300 hover:bg-gray-50 px-3.5 h-8 rounded text-xs transition-colors whitespace-nowrap uppercase tracking-wider">
                    Log In
                  </button>
                </Link>
                <Link to="/register/startup">
                  <button className="flex items-center justify-center font-bold text-red-700 border-[1.5px] border-red-700 hover:bg-red-50 px-3.5 h-8 rounded text-xs transition-colors whitespace-nowrap uppercase tracking-wider">
                    Sign Up <LogIn className="h-3.5 w-3.5 ml-1.5 stroke-[2.5]" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 3. SCROLLING ANNOUNCEMENT TICKER */}
      <div className="bg-gray-100 border-b border-gray-300 py-1.5 text-body text-gray-800 overflow-hidden flex whitespace-nowrap items-center">
        <div className="px-4 text-nav text-red-700 border-r border-gray-300 mr-2">
          {t('landing.marquee.title')}
        </div>
        <marquee className="flex-1" scrollamount="5">
          <span className="mx-8 font-semibold text-gray-900">{t('landing.marquee.m1')}</span>
          <span className="mx-8 text-gray-700">{t('landing.marquee.m2')}</span>
          <span className="mx-8 text-gray-700">{t('landing.marquee.m3')}</span>
        </marquee>
      </div>

      <main id="main-content" className="flex-grow w-full bg-white flex flex-col scroll-mt-20">
        {/* Child Routes injected here */}
        <Outlet />
      </main>

      {/* 9. EXPANDED FOOTER */}
      <footer className="bg-[#1a1a1a] text-white pt-12 pb-8 border-t-4 border-blue-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-4 mb-4 border-b border-gray-700 pb-4 pr-12 w-fit">
                <img src={emblemLogo} alt="Emblem" className="h-10 w-auto object-contain bg-white rounded-full p-1" />
                <div className="flex flex-col">
                  <span className="text-caption text-gray-400">{t('landing.header.govTitle')}</span>
                  <span className="text-card-title text-white">{t('landing.header.portalTitle')}</span>
                </div>
              </div>
              <p className="text-gray-400 text-body max-w-md mb-6">
                {t('landing.footer.desc')}
              </p>
            </div>
            
            <div>
              <h4 className="text-nav text-gray-200 mb-4">{t('landing.footer.quickLinks')}</h4>
              <ul className="space-y-3 text-body text-gray-400">
                <li><Link to="/process" className="hover:text-white transition-colors underline underline-offset-2">{t('landing.footer.links.about')}</Link></li>
                <li><Link to="/register/startup" className="hover:text-white transition-colors underline underline-offset-2">{t('landing.footer.links.registration')}</Link></li>
                <li><a href="#" className="hover:text-white transition-colors underline underline-offset-2">{t('landing.footer.links.faq')}</a></li>
                <li><Link to="/process" className="hover:text-white transition-colors underline underline-offset-2">{t('landing.footer.links.policy')}</Link></li>
                <li><a href="#" className="hover:text-white transition-colors underline underline-offset-2">{t('landing.footer.links.rti')}</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-nav text-gray-200 mb-4">{t('landing.footer.contact')}</h4>
              <ul className="space-y-3 text-body text-gray-400">
                <li>
                  <strong>{t('landing.footer.office')}</strong><br/>
                  {t('landing.footer.address')}
                </li>
                <li>
                  <strong>{t('landing.footer.email')}</strong> support@innovation.maharashtra.gov.in
                </li>
                <li>
                  <strong>{t('landing.footer.phone')}</strong> 1800-XXX-XXXX
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center text-caption">
            <div className="mb-4 md:mb-0">
              {t('landing.footer.copyright')}
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-white transition-colors">{t('landing.footer.privacy')}</a>
              <a href="#" className="hover:text-white transition-colors">{t('landing.footer.terms')}</a>
              <a href="#" className="hover:text-white transition-colors">{t('landing.footer.accessibility')}</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Chatbot */}
      <Chatbot />
    </div>
  );
};

export default PublicLayout;

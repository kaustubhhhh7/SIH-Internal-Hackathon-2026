import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ChallengesPage = () => {
  const { t } = useTranslation();
  
  // Recreate mock data inside component to use translations
  const CHALLENGES = [
    { 
      id: 1,
      dept: t('landing.challenges.c1_dept'), 
      title: t('landing.challenges.c1_title'), 
      budget: '₹50L - ₹1Cr', 
      deadline: 'Oct 15, 2026',
      status: t('challengesPage.filters.accepting'),
      description: t('challengesPage.data.c1_desc')
    },
    { 
      id: 2,
      dept: t('landing.challenges.c2_dept'), 
      title: t('landing.challenges.c2_title'), 
      budget: '₹25L - ₹50L', 
      deadline: 'Oct 22, 2026',
      status: t('challengesPage.filters.accepting'),
      description: t('challengesPage.data.c2_desc')
    },
    { 
      id: 3,
      dept: t('landing.challenges.c3_dept'), 
      title: t('landing.challenges.c3_title'), 
      budget: '₹1Cr - ₹2Cr', 
      deadline: 'Nov 05, 2026',
      status: t('challengesPage.filters.accepting'),
      description: t('challengesPage.data.c3_desc')
    },
    { 
      id: 4,
      dept: t('challengesPage.data.c4_dept'), 
      title: t('challengesPage.data.c4_title'), 
      budget: '₹75L - ₹1.5Cr', 
      deadline: 'Nov 12, 2026',
      status: t('challengesPage.filters.upcoming'),
      description: t('challengesPage.data.c4_desc')
    },
    { 
      id: 5,
      dept: t('challengesPage.data.c5_dept'), 
      title: t('challengesPage.data.c5_title'), 
      budget: '₹10L - ₹20L', 
      deadline: 'Sep 30, 2026',
      status: t('challengesPage.filters.closed'),
      description: t('challengesPage.data.c5_desc')
    }
  ];

  const [filter, setFilter] = useState('All');
  
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChallenges = CHALLENGES.filter(c => {
    const matchFilter = filter === 'All' || c.status === filter;
    const matchSearch = !searchQuery || 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.dept.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen flex flex-col">
      {/* SECONDARY NAVBAR (Sub-Navbar directly below the main portal header) */}
      <div className="bg-[#0b1f3a] text-white border-b border-slate-700/60 shadow-xs sticky top-[57px] z-30">
        <div className="w-full px-4 sm:px-8 lg:px-12 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Left: Section Title & Real-Time Count Indicator */}
          <div className="flex items-center gap-3">
            <h1 className="text-sm sm:text-base font-bold text-white tracking-wide uppercase">
              {t('challengesPage.pageTitle')}
            </h1>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-500/15 border border-emerald-500/30 rounded-xs text-[11px] font-mono font-medium text-emerald-300 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>{filteredChallenges.length} Active Notice{filteredChallenges.length !== 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* Right: Status Filters & Search Bar in the Sub-Navbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center bg-[#071527] p-0.5 rounded-xs border border-slate-700">
              {['All', t('challengesPage.filters.accepting'), t('challengesPage.filters.upcoming'), t('challengesPage.filters.closed')].map(f => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-xs transition-all cursor-pointer ${
                    filter === f || (filter === 'All' && f === 'All') 
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' 
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {f === 'All' ? t('challengesPage.filters.all') : f}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-60">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('challengesPage.searchPlaceholder')} 
                className="w-full bg-[#071527] border border-slate-700 focus:border-amber-400 px-3 py-1 text-xs text-white placeholder:text-slate-400 focus:outline-none rounded-xs"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Main Full-Width Content Container */}
      <div className="w-full px-4 sm:px-8 lg:px-12 py-8 flex-1">
        {/* List of Challenges */}
        <div className="space-y-4">
        {filteredChallenges.map((challenge) => (
          <div 
            key={challenge.id} 
            className="border border-slate-200 bg-white p-6 rounded-lg shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all"
          >
            <div className="flex flex-col lg:flex-row justify-between lg:items-start gap-4 mb-3">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className={`text-[11px] font-bold px-2 py-0.5 uppercase tracking-wide rounded-sm ${
                    challenge.status === t('challengesPage.filters.accepting') 
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                      : challenge.status === t('challengesPage.filters.upcoming') 
                      ? 'bg-amber-50 text-amber-800 border border-amber-200' 
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {challenge.status}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {challenge.dept}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {challenge.title}
                </h3>
              </div>
              
              {/* Key Metrics: Budget & Deadline */}
              <div className="flex items-center gap-6 lg:border-l lg:border-slate-100 lg:pl-6 shrink-0 text-sm">
                <div>
                  <span className="block text-slate-400 text-[10px] uppercase font-bold tracking-wider">{t('challengesPage.budget')}</span>
                  <span className="font-bold text-slate-900 font-mono">{challenge.budget}</span>
                </div>
                <div>
                  <span className="block text-slate-400 text-[10px] uppercase font-bold tracking-wider">{t('challengesPage.deadline')}</span>
                  <span className="font-semibold text-rose-700 font-mono">{challenge.deadline}</span>
                </div>
              </div>
            </div>
            
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 max-w-4xl">
              {challenge.description}
            </p>

            <div className="border-t border-slate-100 pt-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <span className="text-xs text-slate-500">
                Eligibility: <strong className="text-slate-700 font-medium">DPIIT Recognized Startups</strong>
              </span>
              <Link to="/login" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-[#0c2340] hover:bg-[#143763] text-white rounded-md text-xs font-bold uppercase tracking-wider px-5 py-2 shadow-2xs transition-all cursor-pointer">
                  {t('challengesPage.viewDetails')} &rarr;
                </button>
              </Link>
            </div>
          </div>
        ))}

        {filteredChallenges.length === 0 && (
          <div className="p-16 text-center text-slate-500 bg-white border border-slate-200 rounded-lg">
            <p className="font-semibold text-sm">{t('challengesPage.noResults')}</p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default ChallengesPage;

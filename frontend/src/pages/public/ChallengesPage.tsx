import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';

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
  
  const filteredChallenges = CHALLENGES.filter(c => filter === 'All' || c.status === filter);

  return (
    <div className="min-h-screen bg-[#f1f3f6] py-10 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        {/* Official Header Banner */}
        <div className="bg-[#0b1f3a] text-white rounded-t-sm border-t-4 border-amber-500 p-6 shadow-xs mb-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-widest mb-1">
                Government Procurement & Innovation Portal • Problem Statement Registry
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {t('challengesPage.pageTitle')}
              </h1>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                {t('challengesPage.pageDesc')}
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-xs text-[11px] font-mono font-bold text-slate-200 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {filteredChallenges.length} Active Notice{filteredChallenges.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white border-x border-b border-gray-300 p-4 mb-6 shadow-2xs flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-2 hidden sm:inline">Status:</span>
            {['All', t('challengesPage.filters.accepting'), t('challengesPage.filters.upcoming'), t('challengesPage.filters.closed')].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xs border transition-all ${
                  filter === f || (filter === 'All' && f === 'All') 
                    ? 'bg-[#0b1f3a] text-white border-[#0b1f3a] shadow-xs' 
                    : 'bg-slate-50 text-gray-700 border-gray-300 hover:bg-slate-100'
                }`}
              >
                {f === 'All' ? t('challengesPage.filters.all') : f}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <input 
              type="text" 
              placeholder={t('challengesPage.searchPlaceholder')} 
              className="border border-gray-300 px-3 py-1.5 text-xs w-full md:w-64 focus:outline-none focus:ring-1 focus:ring-[#0b1f3a] focus:border-[#0b1f3a] rounded-xs bg-slate-50"
            />
            <Button className="rounded-xs bg-[#0b1f3a] hover:bg-[#15345c] text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 h-auto shrink-0">
              {t('challengesPage.searchBtn')}
            </Button>
          </div>
        </div>

        {/* List of Challenges */}
        <div className="space-y-4">
          {filteredChallenges.map((challenge) => (
            <div 
              key={challenge.id} 
              className="border border-gray-300 bg-white p-5 sm:p-6 rounded-sm shadow-2xs hover:border-[#0b1f3a]/40 hover:shadow-xs transition-all relative overflow-hidden"
            >
              {/* Top Accent Line based on status */}
              <div 
                className={`absolute top-0 left-0 right-0 h-1 ${
                  challenge.status === t('challengesPage.filters.accepting') 
                    ? 'bg-emerald-600' 
                    : challenge.status === t('challengesPage.filters.upcoming') 
                    ? 'bg-amber-500' 
                    : 'bg-slate-400'
                }`}
              />

              <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-3 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-bold text-white px-2 py-0.5 uppercase tracking-wider rounded-2xs inline-block ${
                      challenge.status === t('challengesPage.filters.accepting') 
                        ? 'bg-emerald-700' 
                        : challenge.status === t('challengesPage.filters.upcoming') 
                        ? 'bg-amber-600' 
                        : 'bg-slate-600'
                    }`}>
                      {challenge.status}
                    </span>
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest font-mono">
                      CHAL-{2026000 + challenge.id}
                    </span>
                  </div>
                  <span className="block text-xs font-bold text-amber-700 uppercase tracking-wider pt-1">
                    {challenge.dept}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-[#0b1f3a] hover:text-blue-900 transition-colors">
                    {challenge.title}
                  </h3>
                </div>
                
                <div className="sm:text-right flex-shrink-0 bg-slate-50 border border-gray-200 p-2.5 rounded-xs sm:min-w-[170px]">
                  <div className="mb-1.5">
                    <span className="block text-gray-500 text-[10px] uppercase font-bold tracking-wider">{t('challengesPage.budget')}</span>
                    <span className="font-bold text-gray-900 text-xs sm:text-sm font-mono">{challenge.budget}</span>
                  </div>
                  <div>
                    <span className="block text-gray-500 text-[10px] uppercase font-bold tracking-wider">{t('challengesPage.deadline')}</span>
                    <span className="font-semibold text-rose-700 text-xs font-mono">{challenge.deadline}</span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 text-xs sm:text-sm mb-5 leading-relaxed font-normal">
                {challenge.description}
              </p>

              <div className="border-t border-gray-200 pt-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex items-center gap-4 text-[11px] text-gray-500">
                  <span>Eligibility: <strong>DPIIT Recognized</strong></span>
                  <span>•</span>
                  <span>Fast-track Pilot SLA: <strong>30 Days</strong></span>
                </div>
                <Link to="/login" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto text-[#0b1f3a] border-[#0b1f3a] hover:bg-[#0b1f3a] hover:text-white rounded-xs text-[11px] uppercase tracking-wider font-bold px-4 py-1.5 h-auto transition-all">
                    {t('challengesPage.viewDetails')} &rarr;
                  </Button>
                </Link>
              </div>
            </div>
          ))}
          {filteredChallenges.length === 0 && (
            <div className="p-12 text-center text-gray-500 bg-white border border-gray-300 rounded-sm">
              <p className="font-semibold text-sm">{t('challengesPage.noResults')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChallengesPage;

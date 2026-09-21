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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="mb-10 pb-6 border-b border-gray-300">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">{t('challengesPage.pageTitle')}</h1>
        <p className="text-gray-600 max-w-3xl">
          {t('challengesPage.pageDesc')}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex flex-wrap gap-2">
          {['All', t('challengesPage.filters.accepting'), t('challengesPage.filters.upcoming'), t('challengesPage.filters.closed')].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-sm font-bold uppercase tracking-wide border ${filter === f || (filter === 'All' && f === 'All') ? 'bg-blue-800 text-white border-blue-800' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            >
              {f === 'All' ? t('challengesPage.filters.all') : f}
            </button>
          ))}
        </div>
        <div className="flex space-x-2 w-full sm:w-auto">
          <input 
            type="text" 
            placeholder={t('challengesPage.searchPlaceholder')} 
            className="border border-gray-400 px-3 py-1.5 text-sm w-full sm:w-64 focus:outline-none focus:border-blue-800"
          />
          <Button className="rounded-none bg-gray-800">{t('challengesPage.searchBtn')}</Button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-6">
        {filteredChallenges.map((challenge) => (
          <div key={challenge.id} className="border border-gray-300 bg-white p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-4 gap-4">
              <div>
                <span className={`text-[10px] font-bold text-white px-2 py-0.5 uppercase tracking-wider inline-block w-fit mb-2 ${challenge.status === t('challengesPage.filters.accepting') ? 'bg-green-700' : challenge.status === t('challengesPage.filters.upcoming') ? 'bg-yellow-600' : 'bg-red-700'}`}>
                  {challenge.status}
                </span>
                <span className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{challenge.dept}</span>
                <h3 className="text-xl font-bold text-blue-900">{challenge.title}</h3>
              </div>
              <div className="sm:text-right flex-shrink-0">
                <span className="block text-gray-500 text-[10px] uppercase font-bold tracking-wider">{t('challengesPage.budget')}</span>
                <span className="font-semibold text-gray-900 block mb-2">{challenge.budget}</span>
                <span className="block text-gray-500 text-[10px] uppercase font-bold tracking-wider">{t('challengesPage.deadline')}</span>
                <span className="font-semibold text-red-700 block">{challenge.deadline}</span>
              </div>
            </div>
            
            <p className="text-gray-700 text-sm mb-6 leading-relaxed max-w-4xl">
              {challenge.description}
            </p>

            <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
              <span className="text-xs text-gray-500 font-mono">ID: CHAL-{2026000 + challenge.id}</span>
              <Link to="/login">
                <Button variant="outline" className="text-blue-800 border-blue-800 rounded-none text-xs uppercase tracking-wide font-bold">
                  {t('challengesPage.viewDetails')}
                </Button>
              </Link>
            </div>
          </div>
        ))}
        {filteredChallenges.length === 0 && (
          <div className="p-12 text-center text-gray-500 bg-gray-50 border border-gray-300">
            {t('challengesPage.noResults')}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengesPage;

import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck } from 'lucide-react';

const SectorsPage = () => {
  const { t } = useTranslation();

  const SECTORS = [
    {
      id: 'health',
      title: t('landing.sectors.s1'),
      desc: t('sectorsPage.data.s1_desc'),
      impact: t('sectorsPage.data.s1_impact')
    },
    {
      id: 'edu',
      title: t('landing.sectors.s2'),
      desc: t('sectorsPage.data.s2_desc'),
      impact: t('sectorsPage.data.s2_impact')
    },
    {
      id: 'transport',
      title: t('landing.sectors.s3'),
      desc: t('sectorsPage.data.s3_desc'),
      impact: t('sectorsPage.data.s3_impact')
    },
    {
      id: 'agri',
      title: t('landing.sectors.s4'),
      desc: t('sectorsPage.data.s4_desc'),
      impact: t('sectorsPage.data.s4_impact')
    },
    {
      id: 'fintech',
      title: t('landing.sectors.s5'),
      desc: t('sectorsPage.data.s5_desc'),
      impact: t('sectorsPage.data.s5_impact')
    },
    {
      id: 'gov',
      title: t('landing.sectors.s6'),
      desc: t('sectorsPage.data.s6_desc'),
      impact: t('sectorsPage.data.s6_impact')
    },
    {
      id: 'waste',
      title: t('landing.sectors.s7'),
      desc: t('sectorsPage.data.s7_desc'),
      impact: t('sectorsPage.data.s7_impact')
    },
    {
      id: 'energy',
      title: t('landing.sectors.s8'),
      desc: t('sectorsPage.data.s8_desc'),
      impact: t('sectorsPage.data.s8_impact')
    },
    {
      id: 'urban',
      title: t('landing.sectors.s9'),
      desc: t('sectorsPage.data.s9_desc'),
      impact: t('sectorsPage.data.s9_impact')
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
      <div className="mb-8 sm:mb-12 pb-4 sm:pb-6 border-b border-gray-300 text-center">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">{t('sectorsPage.pageTitle')}</h1>
        <p className="text-xs sm:text-sm md:text-base text-gray-600 max-w-3xl mx-auto leading-relaxed">
          {t('sectorsPage.pageDesc')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {SECTORS.map((sector) => (
          <div key={sector.id} className="border border-gray-300 bg-white p-5 sm:p-6 flex flex-col h-full hover:border-blue-800 transition-colors shadow-2xs">
            <div className="flex items-center mb-3 sm:mb-4">
              <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6 text-blue-800 mr-2.5 sm:mr-3 shrink-0" />
              <h3 className="text-base sm:text-lg font-bold text-gray-900 break-words">{sector.title}</h3>
            </div>
            
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-4 sm:mb-6 flex-grow">
              {sector.desc}
            </p>
            
            <div className="bg-gray-50 border-t border-gray-200 p-3.5 sm:p-4 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 mt-auto">
              <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{t('sectorsPage.goal')}</span>
              <span className="text-xs sm:text-sm font-semibold text-blue-900">{sector.impact}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectorsPage;

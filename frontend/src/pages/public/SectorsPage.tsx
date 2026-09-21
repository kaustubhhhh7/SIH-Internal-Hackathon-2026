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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="mb-12 pb-6 border-b border-gray-300 text-center">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">{t('sectorsPage.pageTitle')}</h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          {t('sectorsPage.pageDesc')}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {SECTORS.map((sector) => (
          <div key={sector.id} className="border border-gray-300 bg-white p-6 flex flex-col h-full hover:border-blue-800 transition-colors">
            <div className="flex items-center mb-4">
              <ShieldCheck className="h-6 w-6 text-blue-800 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">{sector.title}</h3>
            </div>
            
            <p className="text-sm text-gray-700 leading-relaxed mb-6 flex-grow">
              {sector.desc}
            </p>
            
            <div className="bg-gray-50 border-t border-gray-200 p-4 -mx-6 -mb-6 mt-auto">
              <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{t('sectorsPage.goal')}</span>
              <span className="text-sm font-semibold text-blue-900">{sector.impact}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectorsPage;

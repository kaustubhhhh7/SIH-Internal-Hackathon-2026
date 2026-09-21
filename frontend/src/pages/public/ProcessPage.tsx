import React from 'react';
import { useTranslation } from 'react-i18next';

const ProcessPage = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="mb-12 pb-6 border-b border-gray-300 text-center">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">{t('processPage.pageTitle')}</h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          {t('processPage.pageDesc')}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-16 mb-16">
        {/* Startup Process */}
        <div>
          <div className="bg-blue-800 text-white p-4 mb-8 rounded-sm shadow-sm">
            <h2 className="text-lg font-semibold">{t('processPage.p1Title')}</h2>
          </div>
          <div className="space-y-8 pl-4 border-l-2 border-blue-200">
            <div className="relative">
              <div className="absolute -left-[25px] top-1 h-4 w-4 bg-blue-800 rounded-full border-4 border-white"></div>
              <h3 className="text-base font-semibold text-gray-900">{t('processPage.p1_s1_title')}</h3>
              <p className="text-sm text-gray-700 mt-2">{t('processPage.p1_s1_desc')}</p>
            </div>
            <div className="relative">
              <div className="absolute -left-[25px] top-1 h-4 w-4 bg-blue-800 rounded-full border-4 border-white"></div>
              <h3 className="text-base font-semibold text-gray-900">{t('processPage.p1_s2_title')}</h3>
              <p className="text-sm text-gray-700 mt-2">{t('processPage.p1_s2_desc')}</p>
            </div>
            <div className="relative">
              <div className="absolute -left-[25px] top-1 h-4 w-4 bg-blue-800 rounded-full border-4 border-white"></div>
              <h3 className="text-base font-semibold text-gray-900">{t('processPage.p1_s3_title')}</h3>
              <p className="text-sm text-gray-700 mt-2">{t('processPage.p1_s3_desc')}</p>
            </div>
          </div>
        </div>

        {/* Government Process */}
        <div>
          <div className="bg-gray-800 text-white p-4 mb-8 rounded-sm shadow-sm">
            <h2 className="text-lg font-semibold">{t('processPage.p2Title')}</h2>
          </div>
          <div className="space-y-8 pl-4 border-l-2 border-gray-300">
            <div className="relative">
              <div className="absolute -left-[25px] top-1 h-4 w-4 bg-gray-800 rounded-full border-4 border-white"></div>
              <h3 className="text-base font-semibold text-gray-900">{t('processPage.p2_s1_title')}</h3>
              <p className="text-sm text-gray-700 mt-2">{t('processPage.p2_s1_desc')}</p>
            </div>
            <div className="relative">
              <div className="absolute -left-[25px] top-1 h-4 w-4 bg-gray-800 rounded-full border-4 border-white"></div>
              <h3 className="text-base font-semibold text-gray-900">{t('processPage.p2_s2_title')}</h3>
              <p className="text-sm text-gray-700 mt-2">{t('processPage.p2_s2_desc')}</p>
            </div>
            <div className="relative">
              <div className="absolute -left-[25px] top-1 h-4 w-4 bg-gray-800 rounded-full border-4 border-white"></div>
              <h3 className="text-base font-semibold text-gray-900">{t('processPage.p2_s3_title')}</h3>
              <p className="text-sm text-gray-700 mt-2">{t('processPage.p2_s3_desc')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Evaluation Matrix */}
      <div className="bg-gray-50 border border-gray-300 p-8 rounded-sm shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">{t('processPage.matrixTitle')}</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300 text-sm bg-white border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-900 uppercase tracking-wider border-r border-gray-300">{t('processPage.matrixCols.c1')}</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900 uppercase tracking-wider border-r border-gray-300">{t('processPage.matrixCols.c2')}</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900 uppercase tracking-wider">{t('processPage.matrixCols.c3')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 font-semibold border-r border-gray-300">{t('processPage.matrixRows.r1_c1')}</td>
                <td className="px-4 py-3 font-mono border-r border-gray-300">40%</td>
                <td className="px-4 py-3 text-gray-700">{t('processPage.matrixRows.r1_c3')}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold border-r border-gray-300">{t('processPage.matrixRows.r2_c1')}</td>
                <td className="px-4 py-3 font-mono border-r border-gray-300">30%</td>
                <td className="px-4 py-3 text-gray-700">{t('processPage.matrixRows.r2_c3')}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold border-r border-gray-300">{t('processPage.matrixRows.r3_c1')}</td>
                <td className="px-4 py-3 font-mono border-r border-gray-300">20%</td>
                <td className="px-4 py-3 text-gray-700">{t('processPage.matrixRows.r3_c3')}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold border-r border-gray-300">{t('processPage.matrixRows.r4_c1')}</td>
                <td className="px-4 py-3 font-mono border-r border-gray-300">10%</td>
                <td className="px-4 py-3 text-gray-700">{t('processPage.matrixRows.r4_c3')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProcessPage;

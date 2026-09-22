import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import heroImage from '../../assets/images/hero.jpg';
import mumbaiImage from '../../assets/images/mumbai.jpg';
import puneImage from '../../assets/images/pune.jpg';

const HomePage = () => {
  const { t } = useTranslation();

  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    heroImage,
    mumbaiImage,
    puneImage
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* 4. HERO BANNER */}
      <section className="border-b border-gray-300">
        <div className="relative w-full h-[450px] md:h-[550px] overflow-hidden bg-gray-900">
          <div 
            className="flex w-full h-full transition-transform duration-1000 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((src, idx) => (
              <img 
                key={idx}
                src={src} 
                alt={`Hero Banner ${idx + 1}`} 
                className="w-full h-full object-cover flex-shrink-0 min-w-full"
              />
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#061426] via-[#061426]/85 to-[#061426]/40 pointer-events-none"></div>
          <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#061426]/30 to-[#061426]/80 pointer-events-none"></div>
          
          <div className="absolute inset-0 flex flex-col justify-end pb-14 md:pb-20 px-6 sm:px-10 lg:px-16 max-w-7xl mr-auto">
            {/* Government Authority Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0b1f3a]/80 backdrop-blur-md border border-amber-400/40 rounded-xs w-fit mb-4 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest">
                {t('landing.hero.badge')}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-[48px] font-black tracking-tight text-white mb-3 max-w-3xl leading-[1.15] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              {t('landing.hero.title')}
            </h1>
            <p className="text-sm md:text-base text-slate-100 mb-8 max-w-2xl font-medium leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
              {t('landing.hero.subtitle')}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link to="/register/startup">
                <button className="bg-amber-500 hover:bg-amber-600 text-[#0c2340] text-xs md:text-sm font-bold tracking-wider uppercase px-7 py-3.5 rounded-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer border border-amber-400 active:translate-y-0.5">
                  <span>{t('landing.hero.registerBtn')}</span>
                  <span className="text-base leading-none font-bold">&rarr;</span>
                </button>
              </Link>
              <Link to="/process">
                <button className="bg-[#0b1f3a]/70 hover:bg-[#0b1f3a] text-white text-xs md:text-sm font-bold tracking-wider uppercase px-7 py-3.5 rounded-xs border border-white/40 backdrop-blur-sm transition-all cursor-pointer shadow-md active:translate-y-0.5">
                  {t('landing.hero.learnBtn')}
                </button>
              </Link>
            </div>
          </div>

          {/* Carousel Navigation Dots */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2 z-20">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === idx ? 'bg-yellow-500 w-6' : 'bg-white/50 hover:bg-white/80 w-2'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4.5. LATEST ANNOUNCEMENTS TICKER */}
      <div className="bg-blue-900 border-b border-blue-950 flex items-center relative overflow-hidden z-10 h-10 shadow-inner">
        <div className="bg-yellow-500 text-yellow-950 font-extrabold px-4 md:px-6 h-full flex items-center text-xs md:text-sm uppercase tracking-wider shadow-[2px_0_10px_rgba(0,0,0,0.2)] z-20 relative shrink-0">
          {t('landing.announcements.badge')}
        </div>
        <div className="flex-1 overflow-hidden relative h-full flex items-center">
          <div className="animate-marquee whitespace-nowrap text-white text-xs md:text-sm font-medium tracking-wide">
            <span className="mx-8"><span className="text-yellow-400 mr-2">📢</span>{t('landing.announcements.a1')}</span>
            <span className="mx-8"><span className="text-yellow-400 mr-2">🚀</span>{t('landing.announcements.a2')}</span>
            <span className="mx-8"><span className="text-yellow-400 mr-2">⚡</span>{t('landing.announcements.a3')}</span>
            <span className="mx-8"><span className="text-yellow-400 mr-2">🏆</span>{t('landing.announcements.a4')}</span>
            <span className="mx-8"><span className="text-yellow-400 mr-2">📅</span>{t('landing.announcements.a5')}</span>
          </div>
        </div>
      </div>

      {/* 5. YELLOW STATISTICS TABLE */}
      <section id="status-section" className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-12 scroll-mt-24">
        <div className="mb-8 border-l-4 border-yellow-500 pl-4">
          <h2 className="text-section-title mb-1 border-none pb-0">{t('landing.status.title')}</h2>
          <p className="text-caption mt-1">{t('landing.status.subtitle')}</p>
        </div>

        <div className="border border-gray-300 overflow-x-auto rounded-sm shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 border-b border-gray-300">
              <tr>
                <th scope="col" className="px-6 py-4 text-left font-bold text-gray-700 text-small uppercase tracking-wider border-r border-gray-200 whitespace-nowrap">{t('landing.status.headers.activities')}</th>
                <th scope="col" className="px-6 py-4 text-right font-bold text-gray-700 text-small uppercase tracking-wider border-r border-gray-200 whitespace-nowrap">{t('landing.status.headers.it')}</th>
                <th scope="col" className="px-6 py-4 text-right font-bold text-gray-700 text-small uppercase tracking-wider border-r border-gray-200 whitespace-nowrap">{t('landing.status.headers.health')}</th>
                <th scope="col" className="px-6 py-4 text-right font-bold text-gray-700 text-small uppercase tracking-wider border-r border-gray-200 whitespace-nowrap">{t('landing.status.headers.transport')}</th>
                <th scope="col" className="px-6 py-4 text-right font-bold text-gray-700 text-small uppercase tracking-wider border-r border-gray-200 whitespace-nowrap">{t('landing.status.headers.validated')}</th>
                <th scope="col" className="px-6 py-4 text-right font-bold text-gray-900 text-small uppercase tracking-wider bg-gray-100 whitespace-nowrap">{t('landing.status.headers.total')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              <tr className="hover:bg-blue-50/50 transition-colors">
                <td className="px-6 py-4 text-body font-semibold text-gray-800 border-r border-gray-200 whitespace-nowrap">{t('landing.status.rows.published')}</td>
                <td className="px-6 py-4 text-body text-right text-gray-600 border-r border-gray-200">45</td>
                <td className="px-6 py-4 text-body text-right text-gray-600 border-r border-gray-200">12</td>
                <td className="px-6 py-4 text-body text-right text-gray-600 border-r border-gray-200">18</td>
                <td className="px-6 py-4 text-body text-right text-gray-600 border-r border-gray-200">75</td>
                <td className="px-6 py-4 text-body text-right font-bold text-gray-900 bg-gray-50">75</td>
              </tr>
              <tr className="hover:bg-blue-50/50 transition-colors">
                <td className="px-6 py-4 text-body font-semibold text-gray-800 border-r border-gray-200 whitespace-nowrap">{t('landing.status.rows.applications')}</td>
                <td className="px-6 py-4 text-body text-right text-gray-600 border-r border-gray-200">1,240</td>
                <td className="px-6 py-4 text-body text-right text-gray-600 border-r border-gray-200">315</td>
                <td className="px-6 py-4 text-body text-right text-gray-600 border-r border-gray-200">482</td>
                <td className="px-6 py-4 text-body text-right text-gray-600 border-r border-gray-200">2,037</td>
                <td className="px-6 py-4 text-body text-right font-bold text-gray-900 bg-gray-50">2,037</td>
              </tr>
              <tr className="hover:bg-blue-50/50 transition-colors">
                <td className="px-6 py-4 text-body font-semibold text-gray-800 border-r border-gray-200 whitespace-nowrap">{t('landing.status.rows.pilots')}</td>
                <td className="px-6 py-4 text-body text-right text-gray-600 border-r border-gray-200">12</td>
                <td className="px-6 py-4 text-body text-right text-gray-600 border-r border-gray-200">4</td>
                <td className="px-6 py-4 text-body text-right text-gray-600 border-r border-gray-200">7</td>
                <td className="px-6 py-4 text-body text-right text-gray-600 border-r border-gray-200">23</td>
                <td className="px-6 py-4 text-body text-right font-bold text-gray-900 bg-gray-50">23</td>
              </tr>
              <tr className="hover:bg-blue-50/50 transition-colors">
                <td className="px-6 py-4 text-body font-semibold text-gray-800 border-r border-gray-200 whitespace-nowrap">{t('landing.status.rows.procured')}</td>
                <td className="px-6 py-4 text-body text-right text-gray-600 border-r border-gray-200">5</td>
                <td className="px-6 py-4 text-body text-right text-gray-600 border-r border-gray-200">1</td>
                <td className="px-6 py-4 text-body text-right text-gray-600 border-r border-gray-200">3</td>
                <td className="px-6 py-4 text-body text-right text-gray-600 border-r border-gray-200">9</td>
                <td className="px-6 py-4 text-body text-right font-bold text-gray-900 bg-gray-50">9</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* QUICK LINKS SECTION */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pb-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Link to="/challenges" className="group border border-gray-200 bg-white p-8 hover:border-blue-300 hover:shadow-lg transition-all rounded-sm relative overflow-hidden flex flex-col justify-between h-[200px]">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600 transform scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom"></div>
            <div>
              <h3 className="text-xl font-bold text-blue-900 mb-3 flex justify-between items-center">
                {t('landing.header.nav.challenges')} <span className="text-blue-500 group-hover:translate-x-2 transition-transform">&rarr;</span>
              </h3>
              <p className="text-body text-gray-600 leading-relaxed">{t('landing.challenges.subtitle')}</p>
            </div>
          </Link>
          <Link to="/sectors" className="group border border-gray-200 bg-white p-8 hover:border-blue-300 hover:shadow-lg transition-all rounded-sm relative overflow-hidden flex flex-col justify-between h-[200px]">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-green-600 transform scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom"></div>
            <div>
              <h3 className="text-xl font-bold text-blue-900 mb-3 flex justify-between items-center">
                {t('landing.header.nav.sectors')} <span className="text-blue-500 group-hover:translate-x-2 transition-transform">&rarr;</span>
              </h3>
              <p className="text-body text-gray-600 leading-relaxed">{t('landing.sectors.subtitle')}</p>
            </div>
          </Link>
          <Link to="/process" className="group border border-gray-200 bg-white p-8 hover:border-blue-300 hover:shadow-lg transition-all rounded-sm relative overflow-hidden flex flex-col justify-between h-[200px]">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-yellow-500 transform scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom"></div>
            <div>
              <h3 className="text-xl font-bold text-blue-900 mb-3 flex justify-between items-center">
                {t('landing.header.nav.process')} <span className="text-blue-500 group-hover:translate-x-2 transition-transform">&rarr;</span>
              </h3>
              <p className="text-body text-gray-600 leading-relaxed">{t('landing.explore.processDesc')}</p>
            </div>
          </Link>
        </div>
      </section>

      {/* 6. HOW IT WORKS / OFFICIAL STARTUP-TO-GOVERNMENT PROCUREMENT LIFECYCLE */}
      <section className="bg-gradient-to-b from-[#f8fafc] via-[#edf2f7] to-[#e2e8f0] border-t border-gray-300 py-20 relative overflow-hidden">
        {/* Subtle background national seal watermark / pattern */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-blue-900/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
          
          {/* Header Badge & Title */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-900/10 border border-blue-900/20 text-blue-950 text-xs font-bold uppercase tracking-widest mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {t('landing.sop.badge')}
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0b1f3a] tracking-tight mb-4">
              {t('landing.sop.title')}
            </h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium">
              {t('landing.sop.subtitle')}
            </p>
          </div>
          
          {/* 4-Stage Lifecycle Grid */}
          <div className="grid md:grid-cols-4 gap-6 lg:gap-8 relative">
            {/* Horizontal progress connector line (Desktop only) */}
            <div className="hidden md:block absolute top-14 left-[10%] right-[10%] h-1 bg-gradient-to-r from-blue-700 via-amber-500 to-emerald-600 rounded z-0 shadow-sm opacity-60"></div>
            
            {/* Stage 1 */}
            <div className="relative z-10 flex flex-col bg-white rounded-xl p-6 border-2 border-blue-900/20 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0c2340] to-blue-800 text-white font-black text-lg flex items-center justify-center shadow-md">
                  01
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 bg-blue-50 text-blue-800 rounded-full border border-blue-200">
                  {t('landing.sop.stage1.tag')}
                </span>
              </div>
              <h3 className="text-base font-bold text-gray-950 mb-2">{t('landing.sop.stage1.title')}</h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                {t('landing.sop.stage1.desc')}
              </p>
              <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-semibold text-blue-900">
                <span>{t('landing.sop.stage1.sla')}</span>
                <span>{t('landing.sop.stage1.rule')}</span>
              </div>
            </div>
            
            {/* Stage 2 */}
            <div className="relative z-10 flex flex-col bg-white rounded-xl p-6 border-2 border-amber-500/30 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-amber-500 text-white font-black text-lg flex items-center justify-center shadow-md">
                  02
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 bg-amber-50 text-amber-800 rounded-full border border-amber-200">
                  {t('landing.sop.stage2.tag')}
                </span>
              </div>
              <h3 className="text-base font-bold text-gray-950 mb-2">{t('landing.sop.stage2.title')}</h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                {t('landing.sop.stage2.desc')}
              </p>
              <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-semibold text-amber-800">
                <span>{t('landing.sop.stage2.sla')}</span>
                <span>{t('landing.sop.stage2.rule')}</span>
              </div>
            </div>
            
            {/* Stage 3 */}
            <div className="relative z-10 flex flex-col bg-white rounded-xl p-6 border-2 border-purple-500/30 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-800 to-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-md">
                  03
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 bg-purple-50 text-purple-800 rounded-full border border-purple-200">
                  {t('landing.sop.stage3.tag')}
                </span>
              </div>
              <h3 className="text-base font-bold text-gray-950 mb-2">{t('landing.sop.stage3.title')}</h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                {t('landing.sop.stage3.desc')}
              </p>
              <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-semibold text-purple-900">
                <span>{t('landing.sop.stage3.sla')}</span>
                <span>{t('landing.sop.stage3.rule')}</span>
              </div>
            </div>
            
            {/* Stage 4 */}
            <div className="relative z-10 flex flex-col bg-white rounded-xl p-6 border-2 border-emerald-600/30 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-600 text-white font-black text-lg flex items-center justify-center shadow-md">
                  04
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
                  {t('landing.sop.stage4.tag')}
                </span>
              </div>
              <h3 className="text-base font-bold text-gray-950 mb-2">{t('landing.sop.stage4.title')}</h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                {t('landing.sop.stage4.desc')}
              </p>
              <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-semibold text-emerald-800">
                <span>{t('landing.sop.stage4.sla')}</span>
                <span>{t('landing.sop.stage4.rule')}</span>
              </div>
            </div>
          </div>

          {/* Institutional Compliance Ribbon */}
          <div className="mt-14 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm flex flex-wrap items-center justify-around gap-4 text-center">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-semibold text-gray-800">{t('landing.sop.ribbon.f1')}</span>
            </div>
            <div className="hidden sm:block text-gray-300">|</div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <span className="text-xs font-semibold text-gray-800">{t('landing.sop.ribbon.f2')}</span>
            </div>
            <div className="hidden sm:block text-gray-300">|</div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-xs font-semibold text-gray-800">{t('landing.sop.ribbon.f3')}</span>
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default HomePage;

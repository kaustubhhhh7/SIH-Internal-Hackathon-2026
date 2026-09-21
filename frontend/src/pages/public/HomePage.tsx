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
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent pointer-events-none"></div>
          
          <div className="absolute inset-0 flex flex-col justify-end pb-16 md:pb-28 px-4 sm:px-8 lg:px-12 max-w-7xl mr-auto">
            <h1 className="text-3xl md:text-4xl lg:text-[40px] font-bold tracking-tight text-white mb-4 max-w-3xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] leading-tight">
              {t('landing.hero.title')}
            </h1>
            <p className="text-sm md:text-base text-gray-100 mb-8 max-w-2xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)] font-medium">
              {t('landing.hero.subtitle')}
            </p>
            <div className="flex gap-4">
              <Link to="/register/startup">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-yellow-900 text-nav px-6 py-2 border-none rounded-sm shadow-sm transition-all">
                  {t('landing.hero.registerBtn')}
                </Button>
              </Link>
              <Link to="/process">
                <Button variant="ghost" className="bg-transparent text-white border-2 border-white hover:bg-white hover:text-blue-900 text-nav px-6 py-2 rounded-sm shadow-sm transition-all">
                  {t('landing.hero.learnBtn')}
                </Button>
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
          Announcements
        </div>
        <div className="flex-1 overflow-hidden relative h-full flex items-center">
          <div className="animate-marquee whitespace-nowrap text-white text-xs md:text-sm font-medium tracking-wide">
            <span className="mx-8"><span className="text-yellow-400 mr-2">📢</span>Call for Bids: Smart Agriculture & Drone Monitoring Challenge now live (Deadline: Oct 30)</span>
            <span className="mx-8"><span className="text-yellow-400 mr-2">🚀</span>Pilot Milestone: 24 Startups successfully completed Phase 1 PoC trials for Urban Infrastructure</span>
            <span className="mx-8"><span className="text-yellow-400 mr-2">⚡</span>Fast-Track Procurement: DPIIT-recognized startups receive direct work orders under 2026 Guidelines</span>
            <span className="mx-8"><span className="text-yellow-400 mr-2">🏆</span>Success Story: HealthTech startup secures ₹2.5Cr direct state government deployment contract</span>
            <span className="mx-8"><span className="text-yellow-400 mr-2">📅</span>Validation Panel: State Innovation Committee review meeting scheduled for Oct 15th</span>
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
              <p className="text-body text-gray-600 leading-relaxed">Understand the end-to-end procurement lifecycle for startups.</p>
            </div>
          </Link>
        </div>
      </section>

      {/* 6. HOW IT WORKS SECTION */}
      <section className="bg-gray-50 border-t border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">From startup recognition to commercial work orders — a transparent 4-stage portal for government innovation.</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connecting Line (Desktop only) */}
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-gray-300 z-0"></div>
            
            {/* Step 1 */}
            <div className="relative z-10 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-white border-4 border-blue-600 rounded-full flex items-center justify-center text-xl font-bold text-blue-800 mb-4 shadow-sm">1</div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Onboard & Verify</h4>
              <p className="text-sm text-gray-600 px-3">Create your DPIIT-recognized profile, verify company credentials, and list core innovations.</p>
            </div>
            
            {/* Step 2 */}
            <div className="relative z-10 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-white border-4 border-yellow-500 rounded-full flex items-center justify-center text-xl font-bold text-yellow-600 mb-4 shadow-sm">2</div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Submit Proposal</h4>
              <p className="text-sm text-gray-600 px-3">Browse state challenges, submit technical solution bids, and track evaluation in real time.</p>
            </div>
            
            {/* Step 3 */}
            <div className="relative z-10 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-white border-4 border-purple-500 rounded-full flex items-center justify-center text-xl font-bold text-purple-600 mb-4 shadow-sm">3</div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Deploy Paid PoC</h4>
              <p className="text-sm text-gray-600 px-3">Shortlisted innovations execute 90-day field trials with government pilot milestone funding.</p>
            </div>
            
            {/* Step 4 */}
            <div className="relative z-10 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-white border-4 border-green-500 rounded-full flex items-center justify-center text-xl font-bold text-green-600 mb-4 shadow-sm">4</div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Commercial Contract</h4>
              <p className="text-sm text-gray-600 px-3">Top-performing pilot solutions transition directly to GeM-enabled public procurement contracts.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;

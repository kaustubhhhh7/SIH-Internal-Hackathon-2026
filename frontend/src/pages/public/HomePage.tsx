import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HelpCircle, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import heroImage from '../../assets/images/hero.jpg';
import mumbaiImage from '../../assets/images/mumbai.jpg';
import puneImage from '../../assets/images/pune.jpg';
import { 
  getStoredFAQs, 
  addFAQQuestion, 
  answerFAQQuestion, 
  type FAQItem 
} from '../../services/productStore';

const HomePage = () => {
  const { t } = useTranslation();

  const [currentSlide, setCurrentSlide] = useState(0);

  // FAQ State
  const [faqsList, setFaqsList] = useState<FAQItem[]>([]);
  const [selectedFaqCategory, setSelectedFaqCategory] = useState<string>('ALL');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('FAQ-001');
  const [showAskModal, setShowAskModal] = useState(false);
  const [askerName, setAskerName] = useState('');
  const [askerType, setAskerType] = useState<FAQItem['userType']>('Startup / Innovator');
  const [newQuestionCategory, setNewQuestionCategory] = useState<FAQItem['category']>('STARTUP_PROCUREMENT');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);

  // Government Officer Answer modal state
  const [selectedQuestionToAnswer, setSelectedQuestionToAnswer] = useState<FAQItem | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [respondingGovDept, setRespondingGovDept] = useState('Industries & Governance Dept, GoM');

  useEffect(() => {
    setFaqsList(getStoredFAQs());
  }, []);

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim() || !askerName.trim()) return;

    const labelMap: Record<FAQItem['category'], string> = {
      STARTUP_PROCUREMENT: 'Procurement & GeM',
      PILOT_SANDBOX: 'Pilot Sandboxes & Grants',
      GFR_RULES: 'GFR 149 & EMD Rules',
      GENERAL_CITIZEN: 'General Citizen Inquiry'
    };

    const created = addFAQQuestion({
      question: newQuestionText.trim(),
      askedBy: askerName.trim(),
      userType: askerType,
      category: newQuestionCategory,
      categoryLabel: labelMap[newQuestionCategory]
    });

    setFaqsList(getStoredFAQs());
    setExpandedFaqId(created.id);
    setShowAskModal(false);
    setNewQuestionText('');
    setAskerName('');
    setSubmissionSuccess('Your question has been registered on the public helpdesk. It is now awaiting nodal government response.');
  };

  const handleSaveGovAnswer = () => {
    if (!selectedQuestionToAnswer || !answerText.trim()) return;
    answerFAQQuestion(selectedQuestionToAnswer.id, answerText.trim(), respondingGovDept.trim());
    setFaqsList(getStoredFAQs());
    setSelectedQuestionToAnswer(null);
    setAnswerText('');
  };

  const filteredFaqs = faqsList.filter(f => selectedFaqCategory === 'ALL' || f.category === selectedFaqCategory);
  
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
            <h1 className="text-3xl md:text-5xl lg:text-[44px] font-extrabold tracking-tight text-white mb-3.5 max-w-3xl leading-[1.2]">
              {t('landing.hero.title')}
            </h1>
            <p className="text-sm md:text-base text-slate-200 mb-8 max-w-2xl font-normal leading-relaxed">
              {t('landing.hero.subtitle')}
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Link to="/register/startup" className="group">
                <button className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs md:text-[13px] font-bold tracking-wider uppercase px-6 py-3 rounded-md shadow-[0_2px_12px_rgba(245,158,11,0.25)] hover:shadow-[0_4px_16px_rgba(245,158,11,0.35)] transition-all flex items-center gap-2.5 cursor-pointer border border-amber-300 active:scale-[0.98]">
                  <span>{t('landing.hero.registerBtn')}</span>
                  <span className="text-sm font-black transition-transform group-hover:translate-x-1">&rarr;</span>
                </button>
              </Link>
              <Link to="/process">
                <button className="bg-white/10 hover:bg-white/20 text-white text-xs md:text-[13px] font-semibold tracking-wider uppercase px-6 py-3 rounded-md border border-white/30 hover:border-white/50 backdrop-blur-md transition-all cursor-pointer shadow-sm active:scale-[0.98]">
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
      <section className="bg-slate-50 border-t border-b border-slate-200 py-20 relative overflow-hidden">
        {/* Subtle official watermark & grid backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none opacity-60"></div>

        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
          
          {/* Official Administrative Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0c2340] tracking-tight mb-3">
              {t('landing.sop.title')}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              {t('landing.sop.subtitle')}
            </p>
          </div>
          
          {/* 4-Stage Lifecycle Cards with Official Gov/Trust Accents */}
          <div className="grid md:grid-cols-4 gap-6 lg:gap-7 relative">
            {/* Stage Progress Track (Desktop) */}
            <div className="hidden md:block absolute top-[52px] left-[12%] right-[12%] h-[2px] bg-slate-200 z-0"></div>
            
            {/* Stage 1 */}
            <div className="relative z-10 flex flex-col bg-white rounded-lg p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 hover:border-blue-700/50 group">
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 rounded-md bg-[#0c2340] text-white font-mono font-bold text-base flex items-center justify-center shadow-xs ring-4 ring-white">
                  01
                </div>
                <span className="text-[11px] font-semibold tracking-wide px-2.5 py-1 bg-blue-50 text-blue-800 rounded-sm border border-blue-200/80 uppercase">
                  {t('landing.sop.stage1.tag')}
                </span>
              </div>
              <h3 className="text-[16px] font-bold text-slate-900 mb-2.5 group-hover:text-blue-900 transition-colors">
                {t('landing.sop.stage1.title')}
              </h3>
              <p className="text-[13px] text-slate-600 leading-relaxed mb-6 font-normal">
                {t('landing.sop.stage1.desc')}
              </p>
              <div className="mt-auto pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-500">
                <span className="text-slate-700 font-semibold">{t('landing.sop.stage1.sla')}</span>
                <span className="text-blue-800 font-mono font-semibold">{t('landing.sop.stage1.rule')}</span>
              </div>
            </div>
            
            {/* Stage 2 */}
            <div className="relative z-10 flex flex-col bg-white rounded-lg p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 hover:border-amber-600/50 group">
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 rounded-md bg-amber-600 text-white font-mono font-bold text-base flex items-center justify-center shadow-xs ring-4 ring-white">
                  02
                </div>
                <span className="text-[11px] font-semibold tracking-wide px-2.5 py-1 bg-amber-50 text-amber-900 rounded-sm border border-amber-200/80 uppercase">
                  {t('landing.sop.stage2.tag')}
                </span>
              </div>
              <h3 className="text-[16px] font-bold text-slate-900 mb-2.5 group-hover:text-amber-800 transition-colors">
                {t('landing.sop.stage2.title')}
              </h3>
              <p className="text-[13px] text-slate-600 leading-relaxed mb-6 font-normal">
                {t('landing.sop.stage2.desc')}
              </p>
              <div className="mt-auto pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-500">
                <span className="text-slate-700 font-semibold">{t('landing.sop.stage2.sla')}</span>
                <span className="text-amber-800 font-mono font-semibold">{t('landing.sop.stage2.rule')}</span>
              </div>
            </div>
            
            {/* Stage 3 */}
            <div className="relative z-10 flex flex-col bg-white rounded-lg p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 hover:border-indigo-600/50 group">
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 rounded-md bg-indigo-900 text-white font-mono font-bold text-base flex items-center justify-center shadow-xs ring-4 ring-white">
                  03
                </div>
                <span className="text-[11px] font-semibold tracking-wide px-2.5 py-1 bg-indigo-50 text-indigo-900 rounded-sm border border-indigo-200/80 uppercase">
                  {t('landing.sop.stage3.tag')}
                </span>
              </div>
              <h3 className="text-[16px] font-bold text-slate-900 mb-2.5 group-hover:text-indigo-900 transition-colors">
                {t('landing.sop.stage3.title')}
              </h3>
              <p className="text-[13px] text-slate-600 leading-relaxed mb-6 font-normal">
                {t('landing.sop.stage3.desc')}
              </p>
              <div className="mt-auto pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-500">
                <span className="text-slate-700 font-semibold">{t('landing.sop.stage3.sla')}</span>
                <span className="text-indigo-800 font-mono font-semibold">{t('landing.sop.stage3.rule')}</span>
              </div>
            </div>
            
            {/* Stage 4 */}
            <div className="relative z-10 flex flex-col bg-white rounded-lg p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 hover:border-emerald-700/50 group">
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 rounded-md bg-emerald-800 text-white font-mono font-bold text-base flex items-center justify-center shadow-xs ring-4 ring-white">
                  04
                </div>
                <span className="text-[11px] font-semibold tracking-wide px-2.5 py-1 bg-emerald-50 text-emerald-900 rounded-sm border border-emerald-200/80 uppercase">
                  {t('landing.sop.stage4.tag')}
                </span>
              </div>
              <h3 className="text-[16px] font-bold text-slate-900 mb-2.5 group-hover:text-emerald-900 transition-colors">
                {t('landing.sop.stage4.title')}
              </h3>
              <p className="text-[13px] text-slate-600 leading-relaxed mb-6 font-normal">
                {t('landing.sop.stage4.desc')}
              </p>
              <div className="mt-auto pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-500">
                <span className="text-slate-700 font-semibold">{t('landing.sop.stage4.sla')}</span>
                <span className="text-emerald-800 font-mono font-semibold">{t('landing.sop.stage4.rule')}</span>
              </div>
            </div>
          </div>

          {/* Institutional Guarantee / Compliance Footer Bar */}
          <div className="mt-12 bg-white rounded-lg p-4 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-around gap-4 text-center">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span className="text-xs font-semibold text-slate-800">{t('landing.sop.ribbon.f1')}</span>
            </div>
            <div className="hidden sm:block text-slate-300">|</div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-700"></span>
              <span className="text-xs font-semibold text-slate-800">{t('landing.sop.ribbon.f2')}</span>
            </div>
            <div className="hidden sm:block text-slate-300">|</div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-600"></span>
              <span className="text-xs font-semibold text-slate-800">{t('landing.sop.ribbon.f3')}</span>
            </div>
          </div>

        </div>
      </section>

      {/* 7. OFFICIAL FAQ & CITIZEN/STARTUP QUERY RESOLUTION PORTAL (Above Footer) */}
      <section id="faq-section" className="bg-white border-t border-slate-200 py-16 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-slate-200 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0c2340] tracking-tight">
                Government Procurement Helpdesk & Queries
              </h2>
              <p className="text-sm text-slate-600 mt-1.5 max-w-2xl font-normal leading-relaxed">
                Official clarifications published by government departments. Startups, researchers, and citizens can ask questions regarding procurement rules, sandbox pilots, and GFR 149 guidelines.
              </p>
            </div>

            <button
              onClick={() => {
                setShowAskModal(true);
                setSubmissionSuccess(null);
              }}
              className="bg-[#0c2340] hover:bg-[#15345c] text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-md shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer border border-[#0c2340]"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>Ask a Question</span>
            </button>
          </div>

          {/* Quick Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">Category:</span>
            {[
              { id: 'ALL', label: 'All Questions' },
              { id: 'STARTUP_PROCUREMENT', label: 'Procurement & GeM' },
              { id: 'PILOT_SANDBOX', label: 'Sandbox Grants' },
              { id: 'GFR_RULES', label: 'GFR 149 & EMD' },
              { id: 'GENERAL_CITIZEN', label: 'Citizen Oversight' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedFaqCategory(cat.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-md border transition-all cursor-pointer ${
                  selectedFaqCategory === cat.id
                    ? 'bg-[#0c2340] text-white border-[#0c2340] shadow-2xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-3.5 max-w-4xl">
            {filteredFaqs.map((faq) => {
              const isOpen = expandedFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="border border-slate-200 rounded-lg bg-white overflow-hidden transition-all shadow-2xs hover:border-slate-300"
                >
                  <button
                    onClick={() => setExpandedFaqId(isOpen ? null : faq.id)}
                    className="w-full text-left p-5 flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
                  >
                    <div className="space-y-1.5 pr-2">
                      <div className="flex items-center gap-2 flex-wrap text-[11px]">
                        <span className="font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-sm border border-blue-200/80">
                          {faq.categoryLabel}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500 font-medium">
                          Asked by <strong className="text-slate-700">{faq.askedBy}</strong> ({faq.userType}) on {faq.submittedDate}
                        </span>
                      </div>
                      <h3 className="text-[15px] font-bold text-slate-900 leading-snug">
                        {faq.question}
                      </h3>
                    </div>
                    <div className="shrink-0 pt-1 text-slate-400 hover:text-slate-700">
                      {isOpen ? <ChevronUp className="w-5 h-5 text-blue-900" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="p-5 pt-0 border-t border-slate-100 bg-slate-50/50">
                      {faq.answer ? (
                        <div className="mt-4 bg-white p-4 rounded-md border border-slate-200 text-xs sm:text-[13px] text-slate-700 leading-relaxed space-y-2">
                          <div className="flex items-center gap-2 font-bold text-[#0c2340] pb-2 border-b border-slate-100 text-xs uppercase tracking-wide">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <span>Official Government Response</span>
                          </div>
                          <p>{faq.answer}</p>
                          <div className="pt-2 text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-2">
                            <span>Answered by: <strong className="text-slate-800">{faq.answeredByGovDepartment}</strong></span>
                            {faq.answeredDate && <span className="font-mono">{faq.answeredDate}</span>}
                          </div>
                        </div>
                      ) : (
                        <div className="mt-4 bg-amber-50 p-4 rounded-md border border-amber-200 text-xs text-amber-800 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                            <span>Pending official departmental verification & response. Assigned to nodal innovation officer.</span>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedQuestionToAnswer(faq);
                              setAnswerText('');
                            }}
                            className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-sm shrink-0 cursor-pointer shadow-2xs"
                          >
                            Gov Officer: Answer Now
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* MODAL: SUBMIT A NEW QUESTION */}
      {showAskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-2xs animate-fadeIn">
          <div className="bg-white max-w-lg w-full rounded-lg border border-slate-200 shadow-xl overflow-hidden">
            <div className="bg-[#0c2340] text-white p-4 flex items-center justify-between border-b-2 border-amber-500">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider">Submit Question to Government Helpdesk</h3>
              </div>
              <button 
                onClick={() => setShowAskModal(false)}
                className="text-slate-300 hover:text-white cursor-pointer font-bold text-base"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAskSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Your Full Name / Entity Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={askerName}
                  onChange={(e) => setAskerName(e.target.value)}
                  placeholder="e.g. Anand Sharma or GeoDrone Technologies Pvt Ltd"
                  className="w-full text-xs border border-slate-300 rounded-md px-3.5 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0c2340]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Role / Profile <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={askerType}
                    onChange={(e) => setAskerType(e.target.value as any)}
                    className="w-full text-xs border border-slate-300 rounded-md px-3 py-2 bg-slate-50 focus:bg-white font-medium cursor-pointer"
                  >
                    <option value="Startup / Innovator">Startup / Innovator</option>
                    <option value="Citizen">General Citizen</option>
                    <option value="Department Official">Department Official</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Query Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newQuestionCategory}
                    onChange={(e) => setNewQuestionCategory(e.target.value as any)}
                    className="w-full text-xs border border-slate-300 rounded-md px-3 py-2 bg-slate-50 focus:bg-white font-medium cursor-pointer"
                  >
                    <option value="STARTUP_PROCUREMENT">Procurement & GeM</option>
                    <option value="PILOT_SANDBOX">Pilot Sandboxes & Grants</option>
                    <option value="GFR_RULES">GFR 149 & EMD Rules</option>
                    <option value="GENERAL_CITIZEN">General Citizen Inquiry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Your Question / Grievance Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="Specify your question clearly regarding eligibility, sandbox testing, or procurement timelines..."
                  className="w-full text-xs border border-slate-300 rounded-md p-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0c2340]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAskModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-md text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0c2340] hover:bg-[#15345c] text-white rounded-md text-xs font-bold uppercase tracking-wider shadow-xs cursor-pointer"
                >
                  Post Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: GOVERNMENT OFFICER ANSWER MODAL */}
      {selectedQuestionToAnswer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-2xs animate-fadeIn">
          <div className="bg-white max-w-lg w-full rounded-lg border border-slate-200 shadow-xl overflow-hidden">
            <div className="bg-[#0c2340] text-white p-4 flex items-center justify-between border-b-2 border-emerald-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider">Provide Official Government Answer</h3>
              </div>
              <button 
                onClick={() => setSelectedQuestionToAnswer(null)}
                className="text-slate-300 hover:text-white cursor-pointer font-bold text-base"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-slate-50 p-3.5 rounded-md border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Question from {selectedQuestionToAnswer.askedBy}:
                </span>
                <p className="text-xs font-semibold text-slate-800">
                  {selectedQuestionToAnswer.question}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Responding Department / Authority <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={respondingGovDept}
                  onChange={(e) => setRespondingGovDept(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-md px-3.5 py-2 bg-slate-50 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Official Answer & Regulatory Clarification <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={5}
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="Provide reference to government resolutions (GR), GFR rules, or procedural steps..."
                  className="w-full text-xs border border-slate-300 rounded-md p-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0c2340]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedQuestionToAnswer(null)}
                  className="px-4 py-2 border border-slate-300 rounded-md text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveGovAnswer}
                  disabled={!answerText.trim()}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-md text-xs font-bold uppercase tracking-wider shadow-xs cursor-pointer"
                >
                  Publish Official Answer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;

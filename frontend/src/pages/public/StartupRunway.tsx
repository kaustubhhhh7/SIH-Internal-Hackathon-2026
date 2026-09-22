import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bot, 
  Sprout, 
  Cpu, 
  Glasses, 
  Boxes, 
  Zap, 
  ShieldCheck, 
  GraduationCap, 
  HeartPulse, 
  Droplets, 
  Accessibility, 
  Stethoscope, 
  SunMedium,
  Search,
  ArrowRight,
  TrendingUp,
  Award,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export interface RunwayCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  productCount: number;
  highlight: string;
  description: string;
}

export const RUNWAY_CATEGORIES: RunwayCategory[] = [
  {
    id: 'robotics',
    title: 'Advanced Manufacturing & Robotics',
    icon: <Bot className="w-9 h-9 text-[#0c2340]" />,
    productCount: 26,
    highlight: 'DPIIT & Swadeshi Certified',
    description: 'Industrial automation, pipe-crawling inspection bots, and robotic fabrication.'
  },
  {
    id: 'agritech',
    title: 'Agriculture Tech & New Foods',
    icon: <Sprout className="w-9 h-9 text-emerald-700" />,
    productCount: 42,
    highlight: 'Farm-to-Market Enablers',
    description: 'Autonomous crop drones, precision soil sensors, cold-chain monitoring.'
  },
  {
    id: 'ai-bigdata',
    title: 'Artificial Intelligence, Big Data Analytics',
    icon: <Cpu className="w-9 h-9 text-indigo-700" />,
    productCount: 58,
    highlight: 'GovTech Ready',
    description: 'Predictive civic models, dynamic traffic management, citizen sentiment tools.'
  },
  {
    id: 'ar-vr',
    title: 'Augmented / Virtual Reality',
    icon: <Glasses className="w-9 h-9 text-blue-700" />,
    productCount: 19,
    highlight: 'Skill Training Sims',
    description: 'Immersive disaster management training, vocational technical simulators.'
  },
  {
    id: 'blockchain',
    title: 'Blockchain & Web3 Trust',
    icon: <Boxes className="w-9 h-9 text-purple-700" />,
    productCount: 15,
    highlight: 'Immutable Land & Supply Records',
    description: 'Tamper-proof certificate issuing, subsidy DBT tracking, asset provenance.'
  },
  {
    id: 'cleantech',
    title: 'CleanTech / Renewables',
    icon: <Zap className="w-9 h-9 text-amber-600" />,
    productCount: 34,
    highlight: 'Zero-Emission Solutions',
    description: 'Decentralized micro-grids, EV smart chargers, rooftop solar IoT controllers.'
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity & DefTech',
    icon: <ShieldCheck className="w-9 h-9 text-red-700" />,
    productCount: 27,
    highlight: 'CERT-In & STQC Audited',
    description: 'Government cloud posture defense, zero-trust network access, threat intelligence.'
  },
  {
    id: 'edtech',
    title: 'Education Tech',
    icon: <GraduationCap className="w-9 h-9 text-cyan-700" />,
    productCount: 48,
    highlight: 'Vernacular Literacy Tech',
    description: 'Gamified regional learning tools, digital classrooms, AI tutor assistance.'
  },
  {
    id: 'health-lifesciences',
    title: 'Health and Life Sciences',
    icon: <HeartPulse className="w-9 h-9 text-rose-700" />,
    productCount: 39,
    highlight: 'Ayushman Bharat Aligned',
    description: 'Portable vitals kiosks, AI oncology scanners, rural telemedicine rigs.'
  },
  {
    id: 'watertech',
    title: 'Water Tech & Sanitation',
    icon: <Droplets className="w-9 h-9 text-sky-700" />,
    productCount: 22,
    highlight: 'Jal Jeevan Mission Compatible',
    description: 'Real-time potable water quality sensors, sewage robotic desilting, leak detectors.'
  },
  {
    id: 'assistive',
    title: 'Assistive Tech & Inclusion',
    icon: <Accessibility className="w-9 h-9 text-teal-700" />,
    productCount: 14,
    highlight: 'Divyangjan Empowerment',
    description: 'Smart braille peripherals, haptic navigation aids, motorized assistive rigs.'
  },
  {
    id: 'medtech',
    title: 'MedTech Diagnostic Devices',
    icon: <Stethoscope className="w-9 h-9 text-pink-700" />,
    productCount: 31,
    highlight: 'CDSCO Approved',
    description: 'Point-of-care rapid testing, ICU tele-monitoring, non-invasive screening.'
  },
  {
    id: 'renewable',
    title: 'Renewable Power & Storage',
    icon: <SunMedium className="w-9 h-9 text-yellow-600" />,
    productCount: 25,
    highlight: 'Solar & Battery Tech',
    description: 'Solid-state battery banks, solar pumping inverters, smart net-metering.'
  }
];

const StartupRunway: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredCategories = RUNWAY_CATEGORIES.filter(cat => 
    cat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#f0f2f5] min-h-screen text-slate-800 animate-fadeIn">
      
      {/* 1. HERO BANNER - GeM / Gov Themed Dark Blue */}
      <div className="bg-gradient-to-b from-[#002b66] via-[#003380] to-[#0c2340] text-white py-14 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-500 shadow-md relative overflow-hidden">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs uppercase tracking-widest text-amber-300 font-semibold mb-4 backdrop-blur-xs">
            <Award className="w-3.5 h-3.5" />
            <span>Government e-Marketplace (GeM) & Maharashtra State Innovation Society</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight uppercase text-white drop-shadow-sm font-sans">
            STARTUP RUNWAY
          </h1>
          
          <p className="mt-3 text-sm sm:text-lg text-blue-100/90 max-w-3xl mx-auto font-medium leading-relaxed">
            Showcasing innovative products and commercial-ready solutions from the finest DPIIT-recognized Startups in India.
          </p>

          {/* Quick Search on Runway */}
          <div className="mt-8 max-w-xl mx-auto">
            <div className="relative flex items-center shadow-lg rounded-full overflow-hidden bg-white">
              <Search className="absolute left-4 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search across 350+ startup products, technologies, or sectors..."
                className="w-full pl-11 pr-32 py-3.5 text-xs sm:text-sm text-slate-900 focus:outline-none placeholder:text-gray-400"
              />
              <button 
                onClick={() => navigate(`/showcase?search=${encodeURIComponent(searchTerm)}`)}
                className="absolute right-1.5 bg-[#0c2340] hover:bg-[#15345c] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Browse
              </button>
            </div>
          </div>

          {/* Statutory Exemption Highlights */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-blue-200">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> GFR Rule 149 Exempted
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Prior Turnover & Experience Waived
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Direct Government Work Order Eligible
            </span>
          </div>
        </div>

        {/* Subtle Decorative Geometric Backdrop */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
      </div>

      {/* 2. CATEGORY TILES GRID (Matching GeM Startup Runway Layout) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 mb-6 pb-3 border-b border-gray-300">
          <div>
            <div className="text-xs font-bold text-amber-700 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Innovation Domains
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
              Explore Products by Technology Category
            </h2>
          </div>
          <Link
            to="/showcase"
            className="text-xs font-bold text-blue-800 hover:text-blue-950 flex items-center gap-1 uppercase tracking-wider"
          >
            View All Showcase Products ({RUNWAY_CATEGORIES.reduce((acc, c) => acc + c.productCount, 0)}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Grid matching GeM's crisp white cards on blue/grey */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredCategories.map((cat) => (
            <Link
              key={cat.id}
              to={`/showcase?category=${cat.id}`}
              className="group bg-white border border-slate-300 hover:border-blue-900 rounded-xs p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between items-center text-center cursor-pointer relative"
            >
              {/* Product count pill */}
              <span className="absolute top-2.5 right-2.5 text-[10px] font-mono font-semibold text-slate-500 bg-slate-100 group-hover:bg-blue-50 group-hover:text-blue-800 px-1.5 py-0.5 rounded-none border border-slate-200 transition-colors">
                {cat.productCount} Live
              </span>

              {/* Central Icon */}
              <div className="w-16 h-16 rounded-full bg-slate-50 group-hover:bg-blue-50/70 border border-slate-200 group-hover:border-blue-300 flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-105">
                {cat.icon}
              </div>

              {/* Title */}
              <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 group-hover:text-blue-900 leading-snug mb-1 min-h-[36px] flex items-center justify-center">
                {cat.title}
              </h3>

              {/* Highlight Tag */}
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-none border border-emerald-200 mb-2">
                {cat.highlight}
              </span>

              {/* Brief */}
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-4">
                {cat.description}
              </p>

              {/* Action */}
              <div className="mt-auto w-full pt-2.5 border-t border-slate-100 flex items-center justify-center text-[11px] font-bold text-blue-800 group-hover:text-blue-950 uppercase tracking-wider">
                <span>View Catalogue</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>

        {/* 3. PROCUREMENT PATHWAY CALLOUT */}
        <div className="mt-12 bg-white border-l-4 border-l-blue-900 border border-slate-300 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-900 uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5" /> Direct Purchase for Government Departments
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Procure from DPIIT Startups under Maharashtra State Innovation Policy
            </h3>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              State departments, municipal bodies, and public authorities can issue direct purchase orders up to ₹25 Lakhs without prior tender history for validated startup products listed on this runway.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/process"
              className="btn-secondary text-xs py-2.5 px-4 font-bold uppercase tracking-wider"
            >
              Policy Guidelines
            </Link>
            <Link
              to="/showcase"
              className="btn-primary text-xs py-2.5 px-4 font-bold uppercase tracking-wider"
            >
              Explore Products
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};

export default StartupRunway;

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { getStoredProducts } from '../../services/productStore';
import { 
  Search, 
  Filter, 
  Star, 
  ShieldCheck, 
  Building2, 
  ExternalLink, 
  Sparkles, 
  SlidersHorizontal,
  ChevronDown,
  Tag,
  Check,
  Award,
  ShoppingCart,
  ArrowUpDown,
  FileCheck2,
  TrendingDown,
  Info,
  FlaskConical,
  PlusCircle
} from 'lucide-react';

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  categoryName: string;
  startupName: string;
  dpiitReg: string;
  sellerType: 'OEM' | 'Resellers';
  rating: number;
  reviewCount: number;
  verifiedApproval: boolean; // VA badge like GeM
  price: number;
  mrp: number;
  discountPercentage: number;
  minOrderQty: number;
  brand: string;
  imageUrl: string;
  swadeshiCertified: boolean;
  trlLevel: string;
  deliveryPeriodDays: number;
  description: string;
  procurementSpecs: string[];
}

const DUMMY_PRODUCTS: ProductItem[] = [
  {
    id: 'PRD-ROBO-001',
    name: 'ROBOCOUPLER TECHNO SOLUTIONS Automated Robotic Inspection Kiosk',
    category: 'robotics',
    categoryName: 'Advanced Robotics',
    startupName: 'Robocoupler Techno Solutions Pvt Ltd',
    dpiitReg: 'DIPP104829',
    sellerType: 'OEM',
    rating: 4.8,
    reviewCount: 38,
    verifiedApproval: true,
    price: 832043.00,
    mrp: 924492.24,
    discountPercentage: 10,
    minOrderQty: 4,
    brand: 'ROBOCOUPLER',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=400&q=80',
    swadeshiCertified: true,
    trlLevel: 'TRL-8 (Commercial Ready)',
    deliveryPeriodDays: 21,
    description: 'Autonomous multi-sensor patrol and thermal inspection humanoid robot for critical government utility substations and public facilities.',
    procurementSpecs: ['Autonomous LiDAR SLAM', 'Thermal & Optical 4K Zoom', 'IP67 Ingress Protection', 'CERT-In Secured API']
  },
  {
    id: 'PRD-ROBO-002',
    name: 'Endobot Pipeline Inspection Pipe Crawling Robotic Buggy (Series 50)',
    category: 'robotics',
    categoryName: 'Advanced Robotics',
    startupName: 'EndoBot Innovations India LLP',
    dpiitReg: 'DIPP109482',
    sellerType: 'OEM',
    rating: 4.7,
    reviewCount: 24,
    verifiedApproval: true,
    price: 2593403.00,
    mrp: 2881560.00,
    discountPercentage: 10,
    minOrderQty: 1,
    brand: 'Endobot',
    imageUrl: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=400&q=80',
    swadeshiCertified: true,
    trlLevel: 'TRL-9 (Govt Field Proven)',
    deliveryPeriodDays: 14,
    description: 'Ruggedized crawler for municipal underground sewer and potable water pipeline defect mapping with real-time AI crack segmentation.',
    procurementSpecs: ['Tethered 300m range', '360° Pan-Tilt Camera', 'Sonar Thickness Gauge', 'Zero Manual Entry Compliant']
  },
  {
    id: 'PRD-ROBO-003',
    name: 'Endobot Pipeline Inspection Pipe Crawling Robotic System (Series 75)',
    category: 'robotics',
    categoryName: 'Advanced Robotics',
    startupName: 'EndoBot Innovations India LLP',
    dpiitReg: 'DIPP109482',
    sellerType: 'OEM',
    rating: 4.9,
    reviewCount: 19,
    verifiedApproval: true,
    price: 3182814.00,
    mrp: 3536460.00,
    discountPercentage: 10,
    minOrderQty: 1,
    brand: 'Endobot',
    imageUrl: 'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?auto=format&fit=crop&w=400&q=80',
    swadeshiCertified: true,
    trlLevel: 'TRL-9 (Govt Field Proven)',
    deliveryPeriodDays: 14,
    description: 'High-torque heavy drainage crawler with integrated laser profiling for urban municipal corporations and industrial discharge lines.',
    procurementSpecs: ['Explosion-Proof ATEX Certified', '4K Laser Profiling', 'Automatic Pipe Diameter Calibration']
  },
  {
    id: 'PRD-ROBO-004',
    name: 'Endobot Pipeline Inspection Robotic Crawler (All-Terrain Tracked Model)',
    category: 'robotics',
    categoryName: 'Advanced Robotics',
    startupName: 'Apex Swadeshi Automations Pvt Ltd',
    dpiitReg: 'DIPP102319',
    sellerType: 'Resellers',
    rating: 4.4,
    reviewCount: 12,
    verifiedApproval: true,
    price: 3275000.00,
    mrp: 3933334.00,
    discountPercentage: 17,
    minOrderQty: 1,
    brand: 'Endobot',
    imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=400&q=80',
    swadeshiCertified: true,
    trlLevel: 'TRL-8 (Commercial Ready)',
    deliveryPeriodDays: 30,
    description: 'Modular caterpillar drive robotic buggy for silted and sludge-heavy drainage culverts across highway and railway networks.',
    procurementSpecs: ['Multi-Diameter Adaptable 150-1200mm', 'In-line Sludge Buster', 'Full HD Digital Telemetry']
  },
  {
    id: 'PRD-AGRI-001',
    name: 'KisanDrishti Multi-Spectral Autonomous Drone for Agriculture Yield Prediction',
    category: 'agritech',
    categoryName: 'Agriculture Tech',
    startupName: 'Bharat AeroTech Solutions',
    dpiitReg: 'DIPP112930',
    sellerType: 'OEM',
    rating: 4.9,
    reviewCount: 45,
    verifiedApproval: true,
    price: 645000.00,
    mrp: 750000.00,
    discountPercentage: 14,
    minOrderQty: 2,
    brand: 'KisanDrishti',
    imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=400&q=80',
    swadeshiCertified: true,
    trlLevel: 'TRL-9 (Field Proven)',
    deliveryPeriodDays: 10,
    description: 'DGCA Type-Certified mapping drone equipped with 5-band NDVI multi-spectral camera for district agriculture crop insurance audits.',
    procurementSpecs: ['45 min flight endurance', 'Sub-centimeter GSD', 'Automated PMFBY Survey Integration']
  },
  {
    id: 'PRD-AI-001',
    name: 'Pravaah-AI Edge Smart Traffic Signal Controller with Computer Vision Sensor',
    category: 'ai-bigdata',
    categoryName: 'Artificial Intelligence',
    startupName: 'Apex AI Mobility Solutions',
    dpiitReg: 'DIPP104829',
    sellerType: 'OEM',
    rating: 4.8,
    reviewCount: 31,
    verifiedApproval: true,
    price: 485000.00,
    mrp: 550000.00,
    discountPercentage: 12,
    minOrderQty: 3,
    brand: 'Pravaah',
    imageUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=400&q=80',
    swadeshiCertified: true,
    trlLevel: 'TRL-8 (State Validated)',
    deliveryPeriodDays: 14,
    description: 'Edge computing AI hardware module interfacing with existing municipal traffic junction poles to dynamically adapt signal cycle times.',
    procurementSpecs: ['NVIDIA Jetson Edge', 'Compatible with MoRTH standards', 'Direct Smart City ICCC Linkage']
  },
  {
    id: 'PRD-MED-001',
    name: 'ArogyaSetu Portable Tele-ICU Multi-Para Vital Monitor Kiosk',
    category: 'medtech',
    categoryName: 'MedTech Diagnostic Devices',
    startupName: 'VitalsCare MedTech Pvt Ltd',
    dpiitReg: 'DIPP110482',
    sellerType: 'OEM',
    rating: 4.9,
    reviewCount: 52,
    verifiedApproval: true,
    price: 215000.00,
    mrp: 260000.00,
    discountPercentage: 17,
    minOrderQty: 5,
    brand: 'ArogyaSetu',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=400&q=80',
    swadeshiCertified: true,
    trlLevel: 'TRL-9 (CDSCO Approved)',
    deliveryPeriodDays: 7,
    description: 'Solar-chargeable ruggedized health kiosk capturing 12-lead ECG, SpO2, NIBP, and blood glucose for remote Primary Health Centres.',
    procurementSpecs: ['CDSCO Class-B Certified', 'ABHA / ABDM Health ID Cloud Sync', 'Offline Operation up to 72 hours']
  },
  {
    id: 'PRD-WATER-001',
    name: 'JalShuddhi Real-Time Potable Water Quality IoT Analyzer Station',
    category: 'watertech',
    categoryName: 'Water Tech & Sanitation',
    startupName: 'AquaSens Sensors India',
    dpiitReg: 'DIPP114820',
    sellerType: 'OEM',
    rating: 4.6,
    reviewCount: 18,
    verifiedApproval: true,
    price: 185000.00,
    mrp: 210000.00,
    discountPercentage: 12,
    minOrderQty: 2,
    brand: 'JalShuddhi',
    imageUrl: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=400&q=80',
    swadeshiCertified: true,
    trlLevel: 'TRL-8 (Jal Jeevan Tested)',
    deliveryPeriodDays: 14,
    description: 'Continuous monitoring unit for residual chlorine, pH, turbidity, TDS, and heavy metals with automated SMS alerts for rural water tanks.',
    procurementSpecs: ['Solar Powered with Battery Backup', '4G eSIM Telemetry', 'JJM Central Dashboard Integration']
  }
];

const ProductShowcase: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';
  const searchParam = searchParams.get('search') || '';

  const [productsList, setProductsList] = useState<ProductItem[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'rating'>('price-asc');
  const [filterSeller, setFilterSeller] = useState<'ALL' | 'OEM' | 'Resellers'>('ALL');
  const [selectedProductForModal, setSelectedProductForModal] = useState<ProductItem | null>(null);

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    setSearchQuery(searchParam);
  }, [searchParam]);

  useEffect(() => {
    setProductsList(getStoredProducts());
  }, []);

  // Filter products
  const filteredProducts = useMemo(() => {
    return productsList.filter((item) => {
      const matchCat = !selectedCategory || selectedCategory === 'all' || item.category === selectedCategory;
      const matchSearch = !searchQuery || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.startupName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSeller = filterSeller === 'ALL' || item.sellerType === filterSeller;

      return matchCat && matchSearch && matchSeller;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [productsList, selectedCategory, searchQuery, sortBy, filterSeller]);

  return (
    <div className="bg-[#f0f2f5] min-h-screen text-slate-800 pb-16 animate-fadeIn">
      
      {/* 1. TOP GeM-Style Utility Breadcrumb & Filter Bar */}
      <div className="bg-white border-b border-gray-300 py-3 px-4 sm:px-6 lg:px-8 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <Link to="/" className="hover:text-blue-900">Home</Link>
            <span>/</span>
            <Link to="/runway" className="hover:text-blue-900">Startup Runway</Link>
            <span>/</span>
            <span className="font-semibold text-slate-800 capitalize">
              {selectedCategory === 'all' ? 'All Showcase Products' : selectedCategory}
            </span>
          </div>

          {/* Quick Search and Action Buttons inside Showcase */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value) {
                    setSearchParams(prev => {
                      const next = new URLSearchParams(prev);
                      next.set('search', e.target.value);
                      return next;
                    });
                  } else {
                    setSearchParams(prev => {
                      const next = new URLSearchParams(prev);
                      next.delete('search');
                      return next;
                    });
                  }
                }}
                placeholder="Search products, startups, brands..."
                className="input-field pl-9 py-1.5 text-xs w-full bg-slate-50"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedCategory(val);
                setSearchParams(prev => {
                  const next = new URLSearchParams(prev);
                  if (val === 'all') {
                    next.delete('category');
                  } else {
                    next.set('category', val);
                  }
                  return next;
                });
              }}
              className="input-field py-1.5 text-xs w-auto bg-white font-medium"
            >
              <option value="all">All Categories</option>
              <option value="robotics">Advanced Robotics</option>
              <option value="agritech">Agriculture Tech</option>
              <option value="ai-bigdata">Artificial Intelligence</option>
              <option value="medtech">MedTech Diagnostic Devices</option>
              <option value="watertech">Water Tech & Sanitation</option>
              <option value="cleantech">CleanTech / Renewables</option>
              <option value="cybersecurity">Cybersecurity & DefTech</option>
              <option value="edtech">Education Tech</option>
              <option value="health-lifesciences">Health & Life Sciences</option>
              <option value="assistive">Assistive Tech & Inclusion</option>
              <option value="blockchain">Blockchain & Web3 Trust</option>
              <option value="ar-vr">Augmented / Virtual Reality</option>
              <option value="renewable">Renewable Power & Storage</option>
            </select>

            <Link
              to="/startup/products/add"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-emerald-700 text-white hover:bg-emerald-800 transition shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>List Product</span>
            </Link>

            <Link
              to="/gov/sandbox-trials"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-blue-900 text-white hover:bg-blue-800 transition shadow-xs"
            >
              <FlaskConical className="w-3.5 h-3.5 text-amber-300" />
              <span>Sandbox Register</span>
            </Link>
          </div>

        </div>
      </div>

      {/* 2. MAIN SHOWCASE HEADER (Matching GeM Q2 Category Layout) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-300 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {selectedCategory === 'all' ? 'Startup Products Catalogue' : `${filteredProducts[0]?.categoryName || selectedCategory}`}
              </h1>
              <span className="text-[11px] font-mono text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded font-semibold">
                (Q2 Direct Category)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing 1 - {filteredProducts.length} products in eligible startup innovation register
            </p>
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <span className="text-xs font-semibold text-slate-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="input-field py-1.5 px-3 text-xs w-auto bg-white font-medium shadow-2xs cursor-pointer"
            >
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated & Reviewed</option>
            </select>
          </div>
        </div>

        {/* Seller Type Filter Pills */}
        <div className="flex items-center gap-2 mt-4 text-xs font-medium text-slate-600">
          <span>Seller Role:</span>
          {['ALL', 'OEM', 'Resellers'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterSeller(st as any)}
              className={`px-3 py-1 rounded-sm border text-[11px] font-semibold transition-all cursor-pointer ${
                filterSeller === st
                  ? 'bg-[#0c2340] text-white border-[#0c2340]'
                  : 'bg-white text-slate-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {st === 'ALL' ? 'All Sellers' : st}
            </button>
          ))}
          <span className="ml-auto text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> GFR 149 Prior-Turnover Exempt
          </span>
        </div>
      </div>

      {/* 3. PRODUCT CARDS GRID (Exact 4-Column layout as seen in GeM screenshot) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5">
        
        {filteredProducts.length === 0 ? (
          <div className="bg-white border border-gray-300 p-12 text-center rounded-sm">
            <Info className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No products matching your filter</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting category or search criteria.</p>
            <button
              onClick={() => { 
                setSelectedCategory('all'); 
                setSearchQuery(''); 
                setFilterSeller('ALL'); 
                setSearchParams({});
              }}
              className="btn-secondary text-xs mt-4"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredProducts.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-300 hover:border-blue-900 rounded-sm p-4 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group cursor-pointer relative"
                onClick={() => setSelectedProductForModal(item)}
              >
                {/* Top Badges (Startup India + Swadeshi Logo replica) */}
                <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-900">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span>#startupindia</span>
                  </div>
                  {item.swadeshiCertified && (
                    <span className="text-[10px] font-bold text-orange-700 bg-orange-50 border border-orange-200 px-1.5 py-0.2 rounded-xs">
                      स्वदेशी (Swadeshi)
                    </span>
                  )}
                </div>

                {/* Product Image */}
                <div className="h-44 w-full flex items-center justify-center p-2 mb-3 bg-white group-hover:scale-102 transition-transform duration-200 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                </div>

                {/* Product Title */}
                <div className="mb-2">
                  <h3 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-blue-900 min-h-[34px]">
                    {item.name}
                  </h3>
                  
                  {/* Seller & Verification */}
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-600">
                    <span>Seller: <strong>{item.sellerType}</strong></span>
                    {item.verifiedApproval && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-600 text-white flex items-center gap-0.5">
                        VA <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  
                  {/* Rating Badge */}
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="bg-emerald-700 text-white text-[10px] font-bold px-1.5 py-0.2 rounded flex items-center gap-1">
                      {item.rating} ★
                    </span>
                    <span className="text-[10px] text-slate-500">({item.reviewCount} orders)</span>
                  </div>
                </div>

                {/* Brand & Consignee */}
                <div className="text-[11px] text-slate-500 py-1.5 border-t border-gray-100 space-y-0.5">
                  <div>Brand: <strong className="text-slate-700">{item.brand}</strong></div>
                  <div>Min. Qty. Per Consignee: <strong className="text-slate-700">{item.minOrderQty}</strong></div>
                  <div className="text-[10px] text-blue-900 font-semibold">{item.trlLevel}</div>
                </div>

                {/* Price & Discount Pill (Exact GeM Layout) */}
                <div className="mt-3 pt-2 border-t border-gray-200 flex items-baseline justify-between">
                  <div>
                    <div className="text-base font-extrabold text-slate-900 font-sans tracking-tight">
                      ₹ {item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[11px] text-gray-400 line-through">
                      ₹ {item.mrp.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                  </div>

                  <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-2xs">
                    {item.discountPercentage}% OFF
                  </span>
                </div>

                {/* Action Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProductForModal(item);
                  }}
                  className="btn-primary w-full text-xs py-2 mt-3 font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  <span>Procurement Specs</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* 4. MODAL: DETAILED PRODUCT PROCUREMENT SPECIFICATION & WORK ORDER INQUIRY */}
      {selectedProductForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-2xs animate-fadeIn">
          <div className="bg-white max-w-2xl w-full border border-gray-300 shadow-xl rounded-sm overflow-hidden">
            
            {/* Modal Header */}
            <div className="bg-[#0c2340] text-white p-4 flex justify-between items-start border-b-2 border-amber-500">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded">
                  GeM & GoM Direct Work Order Ready
                </span>
                <h3 className="text-base font-bold mt-1 text-white leading-snug">
                  {selectedProductForModal.name}
                </h3>
                <p className="text-xs text-blue-200 mt-0.5">
                  Startup: <strong>{selectedProductForModal.startupName}</strong> • DPIIT: <strong className="font-mono">{selectedProductForModal.dpiitReg}</strong>
                </p>
              </div>
              <button 
                onClick={() => setSelectedProductForModal(null)}
                className="text-gray-300 hover:text-white text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs text-slate-700">
              
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-3 border border-slate-200">
                <img 
                  src={selectedProductForModal.imageUrl} 
                  alt={selectedProductForModal.name} 
                  className="w-24 h-24 object-contain shrink-0" 
                />
                <div className="space-y-1">
                  <div className="text-lg font-bold text-slate-900">
                    ₹ {selectedProductForModal.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    <span className="text-xs text-gray-500 font-normal ml-2">({selectedProductForModal.discountPercentage}% State Rebate Applied)</span>
                  </div>
                  <div className="text-emerald-700 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Ready for Direct Purchase Order under Rule 149 GFR
                  </div>
                  <div className="text-slate-500">
                    Delivery Period: <strong>{selectedProductForModal.deliveryPeriodDays} Days</strong> • Min Consignee Order: <strong>{selectedProductForModal.minOrderQty} Units</strong>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wide mb-1 text-xs">
                  Solution Description
                </h4>
                <p className="text-slate-600 leading-relaxed text-xs">
                  {selectedProductForModal.description}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wide mb-1.5 text-xs">
                  Government Procurement & Technical Specifications
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedProductForModal.procurementSpecs.map((spec: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-slate-100 rounded-xs border border-slate-200 text-slate-800">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-900 shrink-0" />
                      <span className="font-medium">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-3 text-[11px] text-amber-950 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-700" />
                  Statutory Exemption Notification (Maharashtra Innovation Framework 2026):
                </div>
                <p>
                  Government departments purchasing this product are exempt from prior experience and prior turnover requirements. Direct purchase or L1 competitive bidding can be initiated directly via GeM or through State Innovation Society work order sanction.
                </p>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3">
              <span className="text-[11px] text-slate-500">
                Item Ref ID: <strong className="font-mono">{selectedProductForModal.id}</strong>
              </span>
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setSelectedProductForModal(null)}
                  className="btn-secondary text-xs"
                >
                  Close
                </button>

                {/* Government Sandbox Testing Button */}
                <button
                  onClick={() => {
                    navigate(`/gov/request-sandbox?productId=${selectedProductForModal.id}`);
                  }}
                  className="px-3.5 py-2 text-xs font-semibold rounded bg-blue-100 text-blue-900 border border-blue-300 hover:bg-blue-200 transition flex items-center gap-1.5"
                >
                  <FlaskConical className="w-3.5 h-3.5 text-blue-800" />
                  <span>Test in Sandbox</span>
                </button>

                {/* Direct Purchase Order */}
                <button
                  onClick={() => {
                    navigate(`/procurement/issue-po?productId=${selectedProductForModal.id}`);
                  }}
                  className="btn-primary text-xs flex items-center justify-center gap-1.5"
                >
                  <ShoppingCart className="w-3.5 h-3.5 text-amber-300" />
                  <span>Procure / Issue PO</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ProductShowcase;

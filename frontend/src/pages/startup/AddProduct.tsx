import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Building2, 
  Upload, 
  CheckCircle2, 
  ArrowLeft, 
  Save, 
  ShieldCheck, 
  DollarSign, 
  FileText, 
  Tag, 
  AlertCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { productStore } from '../../services/productStore';
import type { StartupProduct } from '../../services/productStore';

const AddStartupProduct: React.FC = () => {
  const navigate = useNavigate();

  // Cached profile if available
  const cachedProfile = (() => {
    try {
      const p = localStorage.getItem('startupProfile');
      return p ? JSON.parse(p) : null;
    } catch {
      return null;
    }
  })();

  const [formData, setFormData] = useState({
    name: '',
    category: 'robotics',
    categoryName: 'Advanced Manufacturing & Robotics',
    brand: '',
    price: '',
    mrp: '',
    minOrderQty: '1',
    deliveryPeriodDays: '14',
    trlLevel: 'TRL-8 (Commercial Ready)',
    sellerType: 'OEM' as 'OEM' | 'Resellers',
    swadeshiCertified: true,
    description: '',
    spec1: '',
    spec2: '',
    spec3: '',
    spec4: '',
    imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=400&q=80'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const categories = [
    { id: 'robotics', name: 'Advanced Manufacturing & Robotics' },
    { id: 'agritech', name: 'Agriculture Tech & New Foods' },
    { id: 'ai-bigdata', name: 'Artificial Intelligence, Big Data' },
    { id: 'ar-vr', name: 'Augmented / Virtual Reality' },
    { id: 'blockchain', name: 'Blockchain & Trust' },
    { id: 'cleantech', name: 'CleanTech / Renewables' },
    { id: 'cybersecurity', name: 'Cybersecurity & DefTech' },
    { id: 'edtech', name: 'Education Tech' },
    { id: 'health-lifesciences', name: 'Health and Life Sciences' },
    { id: 'watertech', name: 'Water Tech & Sanitation' },
    { id: 'assistive', name: 'Assistive Tech & Inclusion' },
    { id: 'medtech', name: 'MedTech Diagnostic Devices' },
    { id: 'renewable', name: 'Renewable Power & Storage' }
  ];

  const handleCategoryChange = (catId: string) => {
    const selected = categories.find(c => c.id === catId);
    setFormData(prev => ({
      ...prev,
      category: catId,
      categoryName: selected?.name || catId
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const priceNum = parseFloat(formData.price) || 50000;
    const mrpNum = parseFloat(formData.mrp) || (priceNum * 1.15);
    const discount = Math.max(5, Math.round(((mrpNum - priceNum) / mrpNum) * 100));

    const specs = [formData.spec1, formData.spec2, formData.spec3, formData.spec4].filter(Boolean);
    if (specs.length === 0) {
      specs.push('DPIIT Innovation Certified', 'CERT-In Web & Cloud Safe', 'State Government Sandbox Ready');
    }

    const newProduct: StartupProduct = {
      id: `PRD-${Date.now().toString().slice(-6)}`,
      name: formData.name,
      category: formData.category,
      categoryName: formData.categoryName,
      startupName: cachedProfile?.companyName || 'Apex AI Mobility Solutions Pvt Ltd',
      dpiitReg: cachedProfile?.dpiitRecognitionNumber || 'DIPP104829',
      sellerType: formData.sellerType,
      rating: 5.0,
      reviewCount: 0,
      verifiedApproval: true,
      price: priceNum,
      mrp: mrpNum,
      discountPercentage: discount,
      minOrderQty: parseInt(formData.minOrderQty) || 1,
      brand: formData.brand || formData.name.split(' ')[0] || 'Swadeshi',
      imageUrl: formData.imageUrl,
      swadeshiCertified: formData.swadeshiCertified,
      trlLevel: formData.trlLevel,
      deliveryPeriodDays: parseInt(formData.deliveryPeriodDays) || 14,
      description: formData.description,
      procurementSpecs: specs,
      departmentTestingStatus: 'NOT_REQUESTED',
      createdAt: new Date().toISOString()
    };

    productStore.saveProduct(newProduct);

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        navigate('/showcase');
      }, 1500);
    }, 600);
  };

  return (
    <div className="bg-[#f0f2f5] min-h-screen py-8 px-4 sm:px-6 lg:px-8 text-slate-800 animate-fadeIn">
      <div className="max-w-4xl mx-auto">
        
        {/* Top Breadcrumb */}
        <div className="mb-4 flex items-center justify-between">
          <Link
            to="/startup/dashboard"
            className="text-xs font-semibold text-slate-600 hover:text-blue-900 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Startup Dashboard
          </Link>
          <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200 font-semibold">
            Rule 149 GFR Direct Catalogue
          </span>
        </div>

        {/* Header */}
        <div className="bg-[#0c2340] text-white p-6 rounded-t-sm shadow-md border-b-4 border-amber-500">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Maharashtra State Innovation Register • GeM Startup Runway</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Publish Startup Product for Government Sale
          </h1>
          <p className="text-xs text-blue-100/90 mt-1 max-w-2xl leading-relaxed">
            List your technology product or hardware solution in the official innovation catalogue. Government departments can view specifications, request sandbox test trials, and issue direct purchase work orders.
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-white p-6 sm:p-8 border border-gray-300 shadow-sm rounded-b-sm">
          {success ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Product Successfully Listed!</h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Your product is now published on the Startup Runway and Government Showcase. Redirecting to product catalogue...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Startup Info Banner */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xs flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-slate-500">Publishing Entity:</span>
                  <div className="font-bold text-slate-900 text-sm">{cachedProfile?.companyName || 'Apex AI Mobility Solutions Pvt Ltd'}</div>
                </div>
                <div>
                  <span className="text-slate-500">DPIIT Recognition:</span>
                  <div className="font-mono font-bold text-blue-900">{cachedProfile?.dpiitRecognitionNumber || 'DIPP104829'}</div>
                </div>
                <div>
                  <span className="text-slate-500">Privilege:</span>
                  <div className="text-emerald-700 font-semibold">Exempt from Prior Turnover</div>
                </div>
              </div>

              {/* 1. Basic Product Details */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-gray-200 pb-2">
                  1. Product Identity & Category
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="form-label text-xs">
                      Official Product / Solution Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                      placeholder="e.g. Endobot Series 50 Autonomous Pipe Inspection Crawler"
                      className="input-field text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="form-label text-xs">
                      Technology Domain <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="input-field text-xs bg-white cursor-pointer"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label text-xs">
                      Brand Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.brand}
                      onChange={(e) => setFormData(p => ({ ...p, brand: e.target.value }))}
                      placeholder="e.g. Endobot"
                      className="input-field text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="form-label text-xs">
                      Technology Readiness Level (TRL)
                    </label>
                    <select
                      value={formData.trlLevel}
                      onChange={(e) => setFormData(p => ({ ...p, trlLevel: e.target.value }))}
                      className="input-field text-xs bg-white cursor-pointer"
                    >
                      <option value="TRL-7 (System Prototype Demonstrated)">TRL-7 (Prototype Demonstrated in Operational Environment)</option>
                      <option value="TRL-8 (Commercial Ready)">TRL-8 (System Complete and Qualified)</option>
                      <option value="TRL-9 (Govt Field Proven)">TRL-9 (Actual System Proven in Operational Mission)</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label text-xs">
                      Seller Classification
                    </label>
                    <select
                      value={formData.sellerType}
                      onChange={(e) => setFormData(p => ({ ...p, sellerType: e.target.value as any }))}
                      className="input-field text-xs bg-white cursor-pointer"
                    >
                      <option value="OEM">Original Equipment Manufacturer (OEM)</option>
                      <option value="Resellers">Authorized Technology Partner / Reseller</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 2. Commercial & Delivery Terms */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-gray-200 pb-2">
                  2. Commercial Terms & Pricing (INR)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="form-label text-xs">
                      Offer Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData(p => ({ ...p, price: e.target.value }))}
                      placeholder="e.g. 850000"
                      className="input-field text-xs font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="form-label text-xs">
                      Standard MRP (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.mrp}
                      onChange={(e) => setFormData(p => ({ ...p, mrp: e.target.value }))}
                      placeholder="e.g. 950000"
                      className="input-field text-xs font-mono text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="form-label text-xs">
                      Min Consignee Qty
                    </label>
                    <input
                      type="number"
                      value={formData.minOrderQty}
                      onChange={(e) => setFormData(p => ({ ...p, minOrderQty: e.target.value }))}
                      className="input-field text-xs"
                    />
                  </div>

                  <div>
                    <label className="form-label text-xs">
                      Delivery Lead Time (Days)
                    </label>
                    <input
                      type="number"
                      value={formData.deliveryPeriodDays}
                      onChange={(e) => setFormData(p => ({ ...p, deliveryPeriodDays: e.target.value }))}
                      className="input-field text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="swadeshi"
                    checked={formData.swadeshiCertified}
                    onChange={(e) => setFormData(p => ({ ...p, swadeshiCertified: e.target.checked }))}
                    className="w-4 h-4 text-blue-900 rounded"
                  />
                  <label htmlFor="swadeshi" className="text-xs text-slate-700 cursor-pointer font-medium">
                    Certified <strong>Make in India / Swadeshi (Local Content &gt; 50%)</strong>
                  </label>
                </div>
              </div>

              {/* 3. Description & Specs */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-gray-200 pb-2">
                  3. Solution Scope & Key Government Specifications
                </h3>

                <div>
                  <label className="form-label text-xs">
                    Solution Overview & Problem Solved <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                    placeholder="Describe how this technology solves specific civic, transport, health, or municipal challenges..."
                    className="input-field text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="form-label text-xs">Key Spec 1 (e.g. Sensor / Range)</label>
                    <input
                      type="text"
                      value={formData.spec1}
                      onChange={(e) => setFormData(p => ({ ...p, spec1: e.target.value }))}
                      placeholder="e.g. 300m Tethered Range with 4K PTZ Camera"
                      className="input-field text-xs"
                    />
                  </div>
                  <div>
                    <label className="form-label text-xs">Key Spec 2 (e.g. Ingress / Durability)</label>
                    <input
                      type="text"
                      value={formData.spec2}
                      onChange={(e) => setFormData(p => ({ ...p, spec2: e.target.value }))}
                      placeholder="e.g. IP68 Submersible up to 10m"
                      className="input-field text-xs"
                    />
                  </div>
                  <div>
                    <label className="form-label text-xs">Key Spec 3 (e.g. Software / AI)</label>
                    <input
                      type="text"
                      value={formData.spec3}
                      onChange={(e) => setFormData(p => ({ ...p, spec3: e.target.value }))}
                      placeholder="e.g. Real-Time Neural Defect Detection"
                      className="input-field text-xs"
                    />
                  </div>
                  <div>
                    <label className="form-label text-xs">Key Spec 4 (e.g. Certifications)</label>
                    <input
                      type="text"
                      value={formData.spec4}
                      onChange={(e) => setFormData(p => ({ ...p, spec4: e.target.value }))}
                      placeholder="e.g. CERT-In Audited API & STQC Tested"
                      className="input-field text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label text-xs">Product Image URL</label>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData(p => ({ ...p, imageUrl: e.target.value }))}
                    className="input-field text-xs font-mono text-gray-600"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/startup/dashboard')}
                  className="btn-secondary text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Publishing to Runway...' : 'Publish Product to Runway'}</span>
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default AddStartupProduct;

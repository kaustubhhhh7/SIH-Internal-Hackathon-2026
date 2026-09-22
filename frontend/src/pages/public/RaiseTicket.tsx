import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { Send, AlertCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import emblemLogo from '../../assets/images/Emblem_of_India_(Government_Gazette).svg.webp';

const RaiseTicket = () => {
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    issueTitle: '',
    issueDescription: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedId = `MAHA-INNOV-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketId(generatedId);
    console.log('Ticket Submitted:', { ...formData, ticketId: generatedId });
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[70vh] bg-[#f1f3f6] py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white border border-gray-300 rounded-sm shadow-sm overflow-hidden">
          <div className="bg-[#0b1f3a] p-5 text-white flex items-center gap-3 border-b-4 border-emerald-600">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">{t('raiseTicket.successTitle')}</h2>
              <p className="text-xs text-slate-300">Public Service Operational Issue Lodged</p>
            </div>
          </div>
          
          <div className="p-6 sm:p-8">
            <div className="bg-slate-50 border border-gray-200 p-4 rounded-xs mb-6 text-center">
              <div className="text-[11px] uppercase tracking-wider text-gray-500 font-bold mb-1">Grievance / Problem Reference ID</div>
              <div className="text-xl sm:text-2xl font-mono font-black text-[#0b1f3a] tracking-widest selection:bg-amber-200">
                {ticketId}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-6 font-normal">
              {t('raiseTicket.successMessage')} <strong className="font-mono">{ticketId}</strong>. {t('raiseTicket.successReview')}
            </p>

            <div className="border-t border-gray-200 pt-5 flex flex-col sm:flex-row justify-between items-center gap-3">
              <span className="text-[11px] text-gray-500 font-medium">SLA: Acknowledgment within 48 Working Hours</span>
              <Button onClick={() => window.location.href = '/'} className="w-full sm:w-auto bg-[#0b1f3a] hover:bg-[#15345c] text-white rounded-xs px-6 py-2 text-xs font-bold uppercase tracking-wider">
                {t('raiseTicket.returnHome')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f3f6] py-10 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        
        {/* National / State Official Departmental Banner */}
        <div className="bg-[#0b1f3a] text-white rounded-t-sm border-t-4 border-amber-500 p-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <img 
                src={emblemLogo} 
                alt="State Emblem of India" 
                className="h-16 w-auto object-contain brightness-0 invert filter shrink-0 opacity-95" 
              />
              <div className="border-l border-white/20 pl-5">
                <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  Government of Maharashtra • Innovation & Public Delivery Cell
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
                  {t('raiseTicket.pageTitle')}
                </h1>
                <p className="text-xs text-slate-300 mt-1 font-normal">
                  Citizen & Department Operational Bottleneck Submission Registry
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/20 rounded-xs text-[11px] font-semibold text-slate-200">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Official Citizen Registry</span>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white border-x border-b border-gray-300 rounded-b-sm shadow-2xs p-6 sm:p-10">
          
          <div className="mb-8 border-b border-gray-200 pb-5">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-1">{t('raiseTicket.cardHeader')}</h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              {t('raiseTicket.pageDesc')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Statutory Advisory Notice */}
            <div className="bg-amber-50/60 border border-amber-300 p-3.5 rounded-xs flex items-start">
              <AlertCircle className="h-4 w-4 text-amber-700 mr-2.5 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-950 font-normal leading-relaxed">
                {t('raiseTicket.note')}
              </p>
            </div>

            {/* Submitter Credentials */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name" className="block text-xs font-semibold text-gray-700 mb-1">
                  {t('raiseTicket.fullName')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder={t('raiseTicket.fullNamePlaceholder')}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1">
                  {t('raiseTicket.email')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                  placeholder={t('raiseTicket.emailPlaceholder')}
                />
              </div>
            </div>

            {/* Department Selection */}
            <div>
              <label htmlFor="department" className="block text-xs font-semibold text-gray-700 mb-1">
                {t('raiseTicket.deptLabel')}
              </label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="input-field bg-white cursor-pointer"
              >
                <option value="">{t('raiseTicket.deptSelect')}</option>
                <option value="agriculture">{t('raiseTicket.depts.agri')}</option>
                <option value="health">{t('raiseTicket.depts.health')}</option>
                <option value="education">{t('raiseTicket.depts.edu')}</option>
                <option value="transport">{t('raiseTicket.depts.transport')}</option>
                <option value="urban">{t('raiseTicket.depts.urban')}</option>
                <option value="other">{t('raiseTicket.depts.other')}</option>
              </select>
            </div>

            {/* Problem Title */}
            <div>
              <label htmlFor="issueTitle" className="block text-xs font-semibold text-gray-700 mb-1">
                {t('raiseTicket.titleLabel')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="issueTitle"
                name="issueTitle"
                required
                value={formData.issueTitle}
                onChange={handleChange}
                className="input-field"
                placeholder={t('raiseTicket.titlePlaceholder')}
              />
            </div>

            {/* Detailed Description */}
            <div>
              <label htmlFor="issueDescription" className="block text-xs font-semibold text-gray-700 mb-1">
                {t('raiseTicket.descLabel')} <span className="text-red-500">*</span>
              </label>
              <p className="text-[11px] text-gray-500 mb-2 leading-tight">
                {t('raiseTicket.descSub')}
              </p>
              <textarea
                id="issueDescription"
                name="issueDescription"
                required
                rows={5}
                value={formData.issueDescription}
                onChange={handleChange}
                className="input-field font-sans"
                placeholder={t('raiseTicket.descPlaceholder')}
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center pt-5 border-t border-gray-200 gap-4">
              <span className="text-[11px] text-gray-500 font-mono">Form Ref: PGC-MH-2026-F1</span>
              <button 
                type="submit" 
                className="w-full sm:w-auto bg-[#0b1f3a] hover:bg-[#15345c] text-white text-xs font-bold uppercase tracking-wider px-8 py-2.5 rounded-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer border border-[#0b1f3a]"
              >
                <span>{t('raiseTicket.submitBtn')}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RaiseTicket;

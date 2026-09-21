import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { FileText, Send, AlertCircle } from 'lucide-react';

const RaiseTicket = () => {
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);
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
    // In a real application, this would make an API call to submit the ticket
    console.log('Ticket Submitted:', formData);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <div className="bg-green-50 border border-green-200 rounded-sm p-10 shadow-sm">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
              <Send className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h2 className="text-page-title text-green-800 mb-4">{t('raiseTicket.successTitle')}</h2>
          <p className="text-body text-gray-700 mb-8 max-w-lg mx-auto">
            {t('raiseTicket.successMessage')} <strong>#TKT-{Math.floor(1000 + Math.random() * 9000)}</strong>.
            {' '}{t('raiseTicket.successReview')}
          </p>
          <Button onClick={() => window.location.href = '/'} className="bg-blue-800 hover:bg-blue-900 text-white rounded-sm px-8">
            {t('raiseTicket.returnHome')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-page-title text-blue-900 mb-2">{t('raiseTicket.pageTitle')}</h1>
        <p className="text-body text-gray-600">
          {t('raiseTicket.pageDesc')}
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
        <div className="bg-blue-50 border-b border-gray-200 px-6 py-4 flex items-center">
          <FileText className="h-5 w-5 text-blue-800 mr-2" />
          <h2 className="text-section-title text-blue-900 m-0 border-none pb-0">{t('raiseTicket.cardHeader')}</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8">
          
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-sm flex items-start mb-8">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-small text-yellow-800">
              {t('raiseTicket.note')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="block text-small font-medium text-gray-700 mb-1">{t('raiseTicket.fullName')} <span className="text-red-500">*</span></label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-blue-500 focus:border-blue-500 text-body"
                placeholder={t('raiseTicket.fullNamePlaceholder')}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-small font-medium text-gray-700 mb-1">{t('raiseTicket.email')} <span className="text-red-500">*</span></label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-blue-500 focus:border-blue-500 text-body"
                placeholder={t('raiseTicket.emailPlaceholder')}
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="department" className="block text-small font-medium text-gray-700 mb-1">{t('raiseTicket.deptLabel')}</label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-blue-500 focus:border-blue-500 text-body bg-white"
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

          <div className="mb-6">
            <label htmlFor="issueTitle" className="block text-small font-medium text-gray-700 mb-1">{t('raiseTicket.titleLabel')} <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="issueTitle"
              name="issueTitle"
              required
              value={formData.issueTitle}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-blue-500 focus:border-blue-500 text-body"
              placeholder={t('raiseTicket.titlePlaceholder')}
            />
          </div>

          <div className="mb-8">
            <label htmlFor="issueDescription" className="block text-small font-medium text-gray-700 mb-1">{t('raiseTicket.descLabel')} <span className="text-red-500">*</span></label>
            <p className="text-caption text-gray-500 mb-2">{t('raiseTicket.descSub')}</p>
            <textarea
              id="issueDescription"
              name="issueDescription"
              required
              rows={6}
              value={formData.issueDescription}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-blue-500 focus:border-blue-500 text-body"
              placeholder={t('raiseTicket.descPlaceholder')}
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <Button type="submit" className="bg-blue-800 hover:bg-blue-900 text-white rounded-sm px-8 py-2.5">
              {t('raiseTicket.submitBtn')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RaiseTicket;

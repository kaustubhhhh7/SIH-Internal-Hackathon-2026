import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// In a real production app, you might load these asynchronously or use a backend plugin
import enTranslations from './locales/en.json';
import mrTranslations from './locales/mr.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      mr: { translation: mrTranslations },
    },
    lng: localStorage.getItem('appLanguage') || 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;

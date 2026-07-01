import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from '@/locales/en/translation.json';
import translationID from '@/locales/id/translation.json';
import translationZH from '@/locales/zh/translation.json';

const resources = {
  en: {
    translation: translationEN,
  },
  id: {
    translation: translationID,
  },
  zh: {
    translation: translationZH,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'id',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
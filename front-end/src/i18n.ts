import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation JSON files 
import enTranslations from './translations/en.json';
import tlTranslations from './translations/tl.json';
import esTranslations from './translations/es.json';

// Translation resources from JSON files
const resources = {
  en: {
    translation: enTranslations
  },
  tl: {
    translation: tlTranslations
  },
  es: {
    translation: esTranslations
  }
};

// my language switching engine vroom vroom
i18n
  .use(LanguageDetector) //detects the user's choice
  .use(initReactI18next) // language changes -> react RERENDERs -> new translation shows up in ui 
  .init({
    resources, //loades translations
    fallbackLng: 'en', //default 
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 
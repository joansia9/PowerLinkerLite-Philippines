import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      header: {
        title: "Power Linker",
        language: "Language"
      },
      footer: {
        copyright: "Copyright © BYU Record Linking Lab 2023. All rights reserved."
      }
    }
  },
  tl: {
    translation: {
      header: {
        title: "Power Linker",
        language: "Wika"
      },
      footer: {
        copyright: "Copyright © BYU Record Linking Lab 2023. Lahat ng karapatan ay nakalaan."
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 
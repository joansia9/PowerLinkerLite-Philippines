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
      home: {
        title: "Match record information to families in the tree",
        hintMessage: "You have completed {{count}} hints.",
        createNew: "Create New"
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
      home: {
        title: "I-match ang impormasyon ng record sa mga pamilya sa puno",
        hintMessage: "Nakumpleto mo ang {{count}} na mga hint.",
        createNew: "Gumawa ng Bago"
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
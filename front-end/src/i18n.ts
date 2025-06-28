import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import only the default language initially (fall back language)
import enTranslations from './translations/en.json';

// Initialize with only default language
const resources = {
  en: {
    translation: enTranslations
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

// Dynamic language loading function
export const loadLanguage = async (languageCode: string) => {
  if (i18n.hasResourceBundle(languageCode, 'translation')) {
    return; // Language already loaded
  }

  try {
    // Dynamic import based on language code
    const translations = await import(`./translations/${languageCode}.json`);
    
    // Add the language to i18n
    i18n.addResourceBundle(languageCode, 'translation', translations.default);
    
    console.log(`Language ${languageCode} loaded dynamically`);
  } catch (error) {
    console.error(`Failed to load language ${languageCode}:`, error);
    // Fallback to English if loading fails
    i18n.changeLanguage('en');
  }
};

// Preload all supported languages (optional)
export const preloadAllLanguages = async () => {
  const languages = ['tl', 'es'];
  const loadPromises = languages.map(lang => loadLanguage(lang));
  await Promise.all(loadPromises);
};

export default i18n; 
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

// Track loading promises to prevent duplicate loads
const loadingPromises: Record<string, Promise<void> | undefined> = {};

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
export const loadLanguage = async (languageCode: string): Promise<void> => {
  // Skip if language is already loaded
  if (i18n.hasResourceBundle(languageCode, 'translation')) {
    console.log(`Language ${languageCode} already loaded`);
    return;
  }

  // Return existing promise if already loading
  if (loadingPromises[languageCode]) {
    console.log(`Language ${languageCode} already loading...`);
    return loadingPromises[languageCode];
  }

  // Create loading promise
  loadingPromises[languageCode] = (async () => {
    try {
      console.log(`🔄 Loading language: ${languageCode}`);
      
      // Dynamic import based on language code
      const translations = await import(`./translations/${languageCode}.json`);
      
      // Add the language to i18n
      i18n.addResourceBundle(languageCode, 'translation', translations.default);
      
      console.log(`✅ Language ${languageCode} loaded successfully`);
    } catch (error) {
      console.error(`❌ Failed to load language ${languageCode}:`, error);
      // Fallback to English if loading fails
      throw error;
    } finally {
      // Clear loading promise
      delete loadingPromises[languageCode];
    }
  })();

  return loadingPromises[languageCode];
};

// Check if language is loaded
export const isLanguageLoaded = (languageCode: string): boolean => {
  return i18n.hasResourceBundle(languageCode, 'translation');
};

// Preload commonly used languages
export const preloadLanguages = (languageCodes: string[]): void => {
  languageCodes.forEach(lang => {
    if (lang !== 'en' && !isLanguageLoaded(lang)) {
      loadLanguage(lang).catch(() => {
        // Silently fail for preloading
      });
    }
  });
};

export default i18n; 
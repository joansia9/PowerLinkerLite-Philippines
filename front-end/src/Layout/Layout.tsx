import * as React from "react";
import { Outlet } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { loadLanguage, preloadLanguages } from '../i18n';
import "./Layout.css";

export interface IAppProps {}

// Define supported languages and STORES them
const languages = [
  { code: 'en', name: 'English' },
  { code: 'tl', name: 'Tagalog' },
  { code: 'es', name: 'Español' },
  { code: 'ceb', name: 'Cebuano' }
];

//MARK: LANGUAGE SELECTOR LOGIC
//implements all features that remain from page to page such as the header, navbar, and footerrrr
export function Layout(props: IAppProps) {
  const { t, i18n } = useTranslation();
  const [isLoadingLanguage, setIsLoadingLanguage] = React.useState(false);
  const [loadError, setLoadError] = React.useState<string | null>(null);
  // t -> translation function
  // i18n -> internationalization object

  // Preload languages on mount for better UX
  React.useEffect(() => {
    const supportedLanguages = languages.map(lang => lang.code);
    preloadLanguages(supportedLanguages);
  }, []);

  //called when the language is changed this function gets called!
  const changeLanguage = async (lng: string) => { //creating a function called changeLanguage
    if (lng === i18n.language) return; // Already on this language

    console.log(`🔄 Switching to language: ${lng}`);
    setIsLoadingLanguage(true);
    setLoadError(null);

    try {
      // Load language dynamically if not already loaded
      await loadLanguage(lng);

      // Change to the language
      i18n.changeLanguage(lng);
      console.log(`✅ Successfully switched to: ${lng}`);

    } catch (error) {
      console.error('❌ Failed to change language:', error);
      setLoadError(`Failed to load ${lng} language`);

      // Fallback to English if loading fails
      try {
        i18n.changeLanguage('en');
        console.log('❌ Fallback to English');
      } catch (fallbackError) {
        console.error('❌ Critical: Failed to fallback to English:', fallbackError);
      }
    } finally {
      setIsLoadingLanguage(false);
    }
  };

  return (
    <>

      {/* Header */}
      <header className="site-header">
        <h1>{t('header.title') as string}</h1>
        <div className="language-selector">
          <select 
            value={i18n.language} 
            onChange={(e) => changeLanguage(e.target.value)}
            className="language-select"
            disabled={isLoadingLanguage}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name} {isLoadingLanguage && lang.code !== i18n.language ? '(Loading...)' : ''}
              </option>
            ))}
          </select>
          {isLoadingLanguage && (
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              {t('loading.language') as string}
            </div>
          )}
          {loadError && (
            <div style={{ fontSize: '12px', color: '#d32f2f', marginTop: '4px' }}>
              {loadError}
            </div>
          )}
        </div>
        <img
          className="logo"
          src="/RLL_Logo_Full.png"
          alt="Record Linking Lab Logo"
        />
      </header>

      {/* Body (injected components) */}
     
        <Outlet />
     

      {/* Footer */}
      <p id="copyright">
        {t('footer.copyright') as string}
      </p>
    </>
  );
}

/* layout component! 
┌─────────────────────────────────────┐
│ Header (Title + Language + Logo)    │
├─────────────────────────────────────┤
│                                     │
│        <Outlet />                   │
│     (Current Page Content)          │
│                                     │
├─────────────────────────────────────┤
│ Footer (Copyright)                  │
└─────────────────────────────────────┘
*/

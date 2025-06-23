import * as React from "react";
import { Outlet } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import "./Layout.css";

export interface IAppProps {}

// Define supported languages and STORES them
const languages = [
  { code: 'en', name: 'English' },
  { code: 'tl', name: 'Tagalog' },
  { code: 'es', name: 'Español' }
];

//implements all features that remain from page to page such as the header, navbar, and footerrrr
export function Layout(props: IAppProps) {
  const { t, i18n } = useTranslation();
  // t -> translation function
  // i18n -> internationalization object

  //called when the language is changed this function gets called!
  const changeLanguage = (lng: string) => { //creating a function called changeLanguage
    i18n.changeLanguage(lng); //calling a DIFFERENT method of the i18n object that is also named language
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
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
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

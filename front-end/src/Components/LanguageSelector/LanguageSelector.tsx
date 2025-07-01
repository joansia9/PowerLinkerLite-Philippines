import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSelector.css';

export function LanguageSelector() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="language-selector">
      <select 
        value={i18n.language} 
        onChange={(e) => changeLanguage(e.target.value)}
        className="language-select"
      >
        <option value="en">English</option>
        <option value="tl">Tagalog</option>
        <option value="es">Español</option>
        <option value="ceb">Cebuano</option>
      </select>
    </div>
  );
} 
// src/components/LanguageSwitcher.jsx
import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    // Optional: Force refresh if components don't update
    window.location.reload();
  };

  return (
    <div className="language-switcher">
      <button 
        onClick={() => changeLanguage('en')}
        className={i18n.language === 'en' ? 'active' : ''}
      >
        English
      </button>
      <button 
        onClick={() => changeLanguage('pt')}
        className={i18n.language === 'pt' ? 'active' : ''}
      >
        Português
      </button>
    </div>
  );
}
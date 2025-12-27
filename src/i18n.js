import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// JSON dosyalarını doğrudan import et
import en from './locales/en/translation.json';
import pt from './locales/pt/translation.json';
import tr from './locales/tr/translation.json';
import es from './locales/es/translation.json';

i18n
  .use(LanguageDetector) // otomatik dil algılama
  .use(initReactI18next) // react-i18next'e bağla
  .init({
    resources: {
      en: { translation: en },
      pt: { translation: pt },
      tr: { translation: tr },
      es: { translation: es },
    },
    fallbackLng: 'en', // desteklenmeyen dil varsa en'e düş
    lng: 'en', // test için sabit dil — sonra kaldırabilirsin
    detection: {
      order: ['localStorage', 'cookie', 'navigator'],
      caches: ['localStorage', 'cookie']
    },
    interpolation: {
      escapeValue: false // React zaten escape eder
    },
    react: {
      useSuspense: false // Suspense hatasını engelle
    }
  });

export default i18n;

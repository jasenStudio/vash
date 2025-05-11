import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en.json";
import es from "./locales/es.json";

const resources = {
  en: { translation: en },
  es: { translation: es },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    // Idioma por defecto
    fallbackLng: "en", // Idioma de respaldo
    detection: {
      order: ["localStorage", "navigator"], // Detectar primero en localStorage
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false, // React ya maneja el escape de valores
    },
  });

export default i18n;

import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import fi from "./locales/fi.json";

export const resources = {
  fi: { translation: fi },
  en: { translation: en },
} as const;

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: import.meta.env.DEV,
    lng: "fi",
    fallbackLng: "fi",
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: resources,
  });

export default i18n;

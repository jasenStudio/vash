import "react-i18next";
import en from "./locales/en.json";
import es from "./locales/es.json";

interface I18nResources {
  en: typeof en;
  es: typeof es;
}

declare module "react-i18next" {
  interface CustomTypeOptions {
    resources: I18nResources;
  }
}

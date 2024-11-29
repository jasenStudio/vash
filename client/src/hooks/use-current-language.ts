import i18next from "i18next";

export const useCurrentLanguage = () => {
  const currentLanguage =
    i18next.language !== "es" && i18next.language !== "en"
      ? "es"
      : i18next.language;

  return { currentLanguage };
};

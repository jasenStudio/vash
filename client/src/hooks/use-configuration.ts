import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { useTheme, type Theme } from "@/vash/providers/theme-provider";

interface Config {
  theme: Theme;
  language: string;
}

export const useConfiguration = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const currentLanguage = i18next.language;

  const [config, setConfig] = useState<Config>({
    theme: theme,
    language: currentLanguage,
  });

  const handleConfigChange = (key: keyof Config, value: string | Theme) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setTheme(config.theme);
    i18next.changeLanguage(config.language);
    toast.success(t("configuration.messageConfirmation"));
  };

  return {
    config,
    handleConfigChange,
    handleSave,
  };
};

import { useEffect, useMemo } from "react";

//* icons
import { Sun, Moon, Settings } from "lucide-react";

//* Components
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

//** Images svg  */
import ColombiaSvg from "@/assets/colombia.svg";
import UsaFlag from "@/assets/usa.svg";

//** Hooks & providers */
import { useTheme, type Theme } from "@/vash/providers/theme-provider";
import { useConfiguration } from "@/hooks/use-configuration";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

interface SettingsDialogProps {
  text?: string;
  className?: string;
  open?: boolean;
  customTrigger?: boolean;
  onOpenChange?: () => void;
}

const data = [
  {
    id: 1,
    value: "light",
    text: "theme.light",
    icon: <Sun size={15} className="w-[15px] inline mx-[5px]" />,
    typeConfiguration: "theme",
  },
  {
    id: 2,
    value: "dark",
    text: "theme.dark",
    icon: <Moon size={15} className="w-[15px] inline mx-[5px]" />,
    typeConfiguration: "theme",
  },
  {
    id: 3,
    value: "es",
    text: "language.es",
    icon: (
      <img
        src={ColombiaSvg}
        alt="Bandera de Colombia"
        className="w-[15px] inline mx-[5px]"
      />
    ),
    typeConfiguration: "language",
  },
  {
    id: 4,
    value: "en",
    text: "language.en",
    icon: (
      <img
        src={UsaFlag}
        alt="Bandera de Estados unidos"
        className="w-[15px] inline mx-[5px]"
      />
    ),
    typeConfiguration: "language",
  },
];

export const SettingDialogCustom = ({
  text,
  className,
  open,
  onOpenChange,
  customTrigger,
}: SettingsDialogProps) => {
  const { config, handleConfigChange, handleSave } = useConfiguration();
  const { t } = useTranslation();
  const { theme } = useTheme();

  const currentLanguage = useMemo(() => {
    return i18next.language !== "es" && i18next.language !== "en"
      ? "es"
      : i18next.language;
  }, [i18next.language]);

  useEffect(() => {
    handleConfigChange("theme", theme);
    handleConfigChange("language", currentLanguage);
    console.log("render");
  }, [theme, currentLanguage]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!customTrigger && (
        <DialogTrigger asChild>
          <Button variant="ghost" className={className}>
            <Settings size={20} />
            {!!text && text}
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-[425px]">
        {/* header */}
        <DialogHeader>
          <DialogTitle className="block my-2 text-xl">
            {t("configuration.title")}
          </DialogTitle>
          <DialogDescription className="text-start text-black dark:text-slate-200 my-4 text-[17px]">
            {t("configuration.description")}
          </DialogDescription>
        </DialogHeader>

        {/* body */}

        <div>
          <span id="selectThemeLabel">{t("configuration.selectTheme")}</span>
          <Select
            value={config.theme}
            onValueChange={(value: Theme) => {
              handleConfigChange("theme", value);
            }}
          >
            <SelectTrigger
              className="w-full text-[17px] my-2"
              aria-labelledby="selectThemeLabel"
            >
              <SelectValue placeholder="Selecciona una Tema" />
            </SelectTrigger>
            <SelectContent>
              {data
                .filter(
                  (SelectItem) => SelectItem.typeConfiguration === "theme"
                )
                .map((selectItem) => (
                  <SelectItem
                    key={selectItem.id}
                    value={selectItem.value}
                    className="flex flex-row justify-center items-center text-[16px] py-3"
                  >
                    {selectItem.icon}
                    {t(selectItem.text)}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <span id="selectLanguageLabel">
            {t("configuration.selectLanguage")}
          </span>
          <Select
            value={config.language}
            onValueChange={(value: string) => {
              handleConfigChange("language", value);
            }}
          >
            <SelectTrigger
              className="w-full text-[17px]"
              aria-labelledby="selectLanguageLabel"
              id="theme"
            >
              <SelectValue placeholder="Selecciona una idioma" />
            </SelectTrigger>
            <SelectContent>
              {data
                .filter((item) => item.typeConfiguration === "language")
                .map((item) => (
                  <SelectItem
                    key={item.id}
                    value={item.value}
                    className="flex flex-row justify-center items-center text-[16px] py-3"
                  >
                    {item.icon}
                    {t(item.text)}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* footer */}
        <DialogFooter className="mt-2">
          <DialogClose asChild className="my-3">
            <Button
              variant="ghost"
              type="button"
              className="font-bold text-[16px] py-6"
            >
              {t("common.close")}
            </Button>
          </DialogClose>
          <DialogClose asChild className="my-3">
            <Button
              type="button"
              onClick={handleSave}
              className="bg-button-primary  hover:bg-button-primary-foreground text-[16px] py-6
               font-bold rounded-sm dark:text-white"
            >
              {t("common.saveChanges")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

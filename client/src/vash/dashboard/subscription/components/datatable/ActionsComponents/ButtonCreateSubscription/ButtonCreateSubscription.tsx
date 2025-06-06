import { Button } from "@/components/ui/button";
import {
  ActionType,
  DialogType,
  TypeComponent,
} from "@/vash/store/ui/useDialog";
import { PlusCircle } from "lucide-react";
import { FC, memo } from "react";
import { useTranslation } from "react-i18next";
interface Props {
  onOpen: (
    typeComponent: TypeComponent,
    dialogType: DialogType,
    actionType: ActionType
  ) => void;
}
export const ButtonCreateSubscription: FC<Props> = memo(({ onOpen }) => {
  const { t } = useTranslation();
  return (
    <Button
      onClick={() => {
        onOpen("dialog", "subscription", "create");
      }}
      className="w-full sm:max-w-[12rem] px-20 my-2 bg-button-primary hover:bg-button-primary-foreground sm:mx-2 text-white focus:ring focus:ring-offset-2   sm:hover:bg-button-primary-foreground sm:hover:ring sm:hover:ring-offset-2  transition-all duration-300"
    >
      <span>{t("entities.subscriptions.add")}</span>
      <PlusCircle className="ml-1" />
    </Button>
  );
});

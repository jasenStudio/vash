import { Button } from "@/components/ui/button";
import {
  ActionType,
  DialogType,
  TypeComponent,
} from "@/vash/store/ui/useDialog";
import { PlusCircle } from "lucide-react";
import { FC, memo } from "react";
interface Props {
  onOpen: (
    typeComponent: TypeComponent,
    dialogType: DialogType,
    actionType: ActionType
  ) => void;
}
export const ButtonCreateAccount: FC<Props> = memo(({ onOpen }) => {
  return (
    <Button
      onClick={() => {
        onOpen("dialog", "account", "create");
      }}
      className="w-full my-2 bg-button-primary hover:bg-button-primary-foreground mr-2 text-white focus:ring focus:ring-offset-2 sm:w-[10rem] sm:hover:bg-button-primary-foreground sm:hover:ring sm:hover:ring-offset-2  transition-all duration-300"
    >
      Create Account <PlusCircle className="ml-1" />
    </Button>
  );
});

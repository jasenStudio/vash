import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreHorizontal } from "lucide-react";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Subcription } from "../columns";

interface Props {
  subscription: Subcription;
}

const MenuActions: FC<Props> = ({ subscription }) => {
  const { t } = useTranslation();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem> {t("common.ViewDetails")}</DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={(e: any) => {
            e.stopPropagation();
          }}
        >
          {t("entities.subscriptions.update")}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={(e: any) => {
            e.stopPropagation();
            console.log(subscription.id);
          }}
        >
          {t("entities.subscriptions.delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MenuActions;

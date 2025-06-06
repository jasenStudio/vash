import { Button } from "@/components/ui/button";

import { FC, memo } from "react";
import { useTranslation } from "react-i18next";

interface ButtonDialogProps {
  isPending: boolean;
  actionType: string;
}

export const ButtonDialog: FC<ButtonDialogProps> = memo(
  ({ isPending, actionType }) => {
    let message;
    const { t } = useTranslation();

    if (isPending && actionType === "create") {
      message = "Creando...";
    }

    if (isPending && actionType !== "create") {
      message = "Actualizando...";
    }

    actionType === "create"
      ? (message = t("entities.account.create"))
      : (message = t("entities.account.update"));

    // ? "cargando..."
    // : actionType === "create"
    // ? t("entities.account.create")
    // : t("entities.account.update");

    return (
      <Button
        className="bg-button-primary text-white hover:bg-button-primary-foreground"
        disabled={isPending}
        type="submit"
      >
        {message}
      </Button>
    );
  }
);

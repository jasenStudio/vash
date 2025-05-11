import { Button } from "@/components/ui/button";

import { FC, memo } from "react";

interface ButtonDialogProps {
  isPending: boolean;
  actionType: string;
}

export const ButtonDialog: FC<ButtonDialogProps> = memo(
  ({ isPending, actionType }) => {
    const message = isPending
      ? "cargando..."
      : actionType === "create"
      ? "Crear account"
      : "Actualizar account";

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

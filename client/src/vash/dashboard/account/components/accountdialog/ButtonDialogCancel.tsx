import { Button } from "@/components/ui/button";
import { FC, memo, useMemo } from "react";
import { useTranslation } from "react-i18next";

interface ButtonDialogProps {
  onClose: () => void;
}

export const ButtonDialogCancel: FC<ButtonDialogProps> = memo(({ onClose }) => {
  const { t } = useTranslation();
  const label = useMemo(() => t("common.close"), [t]);
  return (
    <Button onClick={onClose} variant="ghost">
      {label}
    </Button>
  );
});

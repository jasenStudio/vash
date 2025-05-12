import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { FC, memo } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  isDeleteRecord: boolean;
  rowsSelected: number;
  onHandleDelete: () => void;
}
export const ButtonDeleteAccount: FC<Props> = memo(
  ({ isDeleteRecord, rowsSelected, onHandleDelete }) => {
    const { t } = useTranslation();
    return (
      <Button
        disabled={!isDeleteRecord}
        className={`w-full sm:w-[12rem] ${
          isDeleteRecord ? "animate-scaleIn" : "animate-scaleOut"
        }`}
        variant="destructive"
        onClick={onHandleDelete}
      >
        {rowsSelected > 1
          ? t("entities.account.delete_accounts")
          : t("entities.account.delete")}
        <span>({rowsSelected})</span>
        <Trash />
      </Button>
    );
  }
);

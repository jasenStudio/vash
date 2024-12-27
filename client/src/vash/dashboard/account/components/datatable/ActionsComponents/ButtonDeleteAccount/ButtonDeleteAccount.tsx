import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { FC, memo } from "react";

interface Props {
  isDeleteRecord: boolean;
  rowsSelected: number;
  onHandleDelete: () => void;
}
export const ButtonDeleteAccount: FC<Props> = memo(
  ({ isDeleteRecord, rowsSelected, onHandleDelete }) => {
    return (
      <Button
        disabled={!isDeleteRecord}
        className={`w-full sm:w-[12rem] ${
          isDeleteRecord ? "animate-scaleIn" : "animate-scaleOut"
        }`}
        variant="destructive"
        onClick={onHandleDelete}
      >
        delete {rowsSelected > 1 ? "accounts" : "account"}
        <span>({rowsSelected})</span>
        <Trash />
      </Button>
    );
  }
);

import { ChangeEvent, FC, memo } from "react";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";

interface InputFilterProps {
  value: string;
  onChangeFilter: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const InputAccountEmailFilter: FC<InputFilterProps> = memo(
  ({ value, onChangeFilter }) => {
    const { t } = useTranslation();
    return (
      <div className="w-full my-2">
        <Input
          placeholder={t("entities.account.filter_placeholder_account")}
          value={value || ""}
          onChange={onChangeFilter}
          className="max-w-sm"
        />
      </div>
    );
  }
);

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FC, memo } from "react";
import { useTranslation } from "react-i18next";

interface SelectStatusFilterProps {
  status: string;
  onStatusSelectChange: (status: string) => void;
}

export const SelectStatusFilter: FC<SelectStatusFilterProps> = memo(
  ({ status, onStatusSelectChange }) => {
    const { t } = useTranslation();
    return (
      <div className="w-full my-2">
        <Select value={status} onValueChange={onStatusSelectChange}>
          <SelectTrigger className="w-full sm:w-[180px] sm:ml-2">
            <SelectValue placeholder="Status - Active" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{t("common.status")}</SelectLabel>
              <SelectItem value="all">{t("common.all")}</SelectItem>
              <SelectItem value="true">{t("common.active")}</SelectItem>
              <SelectItem value="false">{t("common.inactive")}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    );
  }
);

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

interface SelectStatusFilterProps {
  status: string;
  onStatusSelectChange: (status: string) => void;
}

export const SelectStatusFilter: FC<SelectStatusFilterProps> = memo(
  ({ status, onStatusSelectChange }) => {
    return (
      <Select value={status} onValueChange={onStatusSelectChange}>
        <SelectTrigger className="w-full sm:w-[180px] sm:ml-2">
          <SelectValue placeholder="Status - Active" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>status</SelectLabel>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  }
);

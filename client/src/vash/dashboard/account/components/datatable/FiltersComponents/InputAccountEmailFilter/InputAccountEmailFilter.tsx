import { ChangeEvent, FC, memo } from "react";
import { Input } from "@/components/ui/input";

interface InputFilterProps {
  value: string;
  onChangeFilter: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const InputAccountEmailFilter: FC<InputFilterProps> = memo(
  ({ value, onChangeFilter }) => {
    return (
      <div className="w-full my-2">
        <Input
          placeholder="Filter emails..."
          value={value || ""}
          onChange={onChangeFilter}
          className="max-w-sm"
        />
      </div>
    );
  }
);

import { ChangeEvent, FC, memo } from "react";
import { Input } from "@/components/ui/input";

interface InputFilterProps {
  value: string;
  onChangeFilter: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const InputSubscriptionEmailFilter: FC<InputFilterProps> = memo(
  ({ value, onChangeFilter }) => {
    return (
      <Input
        placeholder="Filter emails..."
        value={value || ""}
        onChange={onChangeFilter}
        className="max-w-sm"
      />
    );
  }
);

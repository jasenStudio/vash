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

interface PaginationLimitedProps {
  rowsSelected: number;
  rowsFiltered: number;
  limitedAccount: number;
  sizePages: number[];
  onLimitAccount: (value: number) => void;
  onPageSize: (value: number) => void;
}

export const PaginationLimitControl: FC<PaginationLimitedProps> = memo(
  ({
    rowsSelected,
    rowsFiltered,
    limitedAccount,
    sizePages,
    onLimitAccount,
    onPageSize,
  }) => {
    return (
      <>
        <div className="flex-1 text-sm text-muted-foreground my-5">
          {rowsSelected} of {rowsFiltered} row(s) selected.
        </div>

        <Select
          value={`${limitedAccount}`}
          onValueChange={(value) => {
            onPageSize(+value);
            onLimitAccount(+value);
          }}
        >
          <SelectTrigger className="w-[180px] m-2">
            <SelectValue placeholder={`${limitedAccount}`} />
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Rows per page</SelectLabel>
                {sizePages.map((size) => (
                  <SelectItem value={`${size}`} key={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </SelectTrigger>
        </Select>
      </>
    );
  }
);

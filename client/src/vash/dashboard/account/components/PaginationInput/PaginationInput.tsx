import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";

interface PageInputProps {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export const PaginationInput: React.FC<PageInputProps> = ({
  currentPage,
  totalPages,
  onChange,
}) => {
  const [localPage, setLocalPage] = useState<number | undefined>(currentPage);

  useEffect(() => {
    setLocalPage(currentPage);
  }, [currentPage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = +e.currentTarget.value;

    if (isNaN(value) || value < 1) {
      setLocalPage(1);
    } else if (value > totalPages) {
      setLocalPage(totalPages);
    } else {
      setLocalPage(value);
    }
  };

  const onSetPage = () => {
    onChange(localPage!);
  };

  return (
    <>
      <Input
        name={"page"}
        type="number"
        value={localPage}
        onChange={handleInputChange}
        placeholder="1"
        onFocus={(e) => {
          e.target.select();
        }}
        min={1}
        max={totalPages}
        className="w-16 text-center border-white"
      />

      <Button className="my-5 mx-2" onClick={onSetPage}>
        Go to page
      </Button>
    </>
  );
};
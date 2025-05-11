import { ColumnDef, VisibilityState } from "@tanstack/react-table";

import { useEffect } from "react";
interface Props<TData, TValue> {
  isMobile: boolean;
  columns: ColumnDef<TData, TValue>[];
  setColumnVisibility: (value: VisibilityState) => void;
}

export const useAccountDataTablemobile = <TData, TValue>({
  isMobile,
  columns,
  setColumnVisibility,
}: Props<TData, TValue>) => {
  const mobileVisibleColumns = ["account_email", "actions", "select"];
  const desktopVisibleColumns = columns.map((col) => col.id);

  useEffect(() => {
    const visibleColumns = isMobile
      ? mobileVisibleColumns
      : desktopVisibleColumns;
    const newVisibility: VisibilityState = {};
    columns.forEach((column) => {
      if (column.id) {
        newVisibility[column.id] = visibleColumns.includes(column.id);
      }
    });
    setColumnVisibility(newVisibility);
  }, [isMobile, columns]);
};

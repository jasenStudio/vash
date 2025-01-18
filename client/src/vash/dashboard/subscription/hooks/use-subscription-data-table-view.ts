import { useEffect } from "react";
import { ColumnDef, VisibilityState } from "@tanstack/react-table";

interface Props<TData, TValue> {
  isMobile: boolean;
  columns: ColumnDef<TData, TValue>[];
  setColumnVisibility: (value: VisibilityState) => void;
}

export const useSubscriptionDataTableView = <TData, TValue>({
  isMobile,
  columns,
  setColumnVisibility,
}: Props<TData, TValue>) => {
  const mobileVisibleColumns = ["account_email", "actions", "select"];
  const VisibleColumnsDefault = columns
    .filter((col) => col.id !== "user_name_subscription")
    .map((col) => col.id);
  useEffect(() => {
    const visibleColumns = isMobile
      ? mobileVisibleColumns
      : VisibleColumnsDefault;
    const newVisibility: VisibilityState = {};

    columns.forEach((column) => {
      if (column.id) {
        newVisibility[column.id] = visibleColumns.includes(column.id);
      }
    });

    setColumnVisibility(newVisibility);
  }, [isMobile, columns]);
};

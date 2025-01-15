"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const columnName = (name: string) => {
  switch (name) {
    case "account_email":
      return "Email";
    case "name_service":
      return "services";
    case "user_name_subscription":
      return "User Name";
    default:
      return name;
  }
};

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
    },
  });
  const isMobile = useIsMobile();
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

  return (
    <>
      <div className="flex flex-col sm:grid sm:grid-cols-4 items-center py-4 justify-between">
        <div className="w-full my-2">
          {" "}
          {/* <ButtonCreateAccount onOpen={onOpen} /> */}
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              // className={`${isMobile ? "w-full" : ""}`}
            >
              <Button variant="outline" className="ml-auto">
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              // className={`${isMobile && "min-w-[18rem]"}`}
            >
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  const columName = columnName(column.id);
                  // column.id === "account_email" ? "email" : column.id;

                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className={`capitalize`}
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => {
                        column.toggleVisibility(!!value);
                      }}
                    >
                      {columName}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

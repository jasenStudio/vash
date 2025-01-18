"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  VisibilityState,
  /* Filter */
  ColumnFiltersState,
  getFilteredRowModel,
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

import { InputSubscriptionEmailFilter, SelectStatusFilter } from "..";

import { Button } from "@/components/ui/button";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useDebounce, useIsMobile } from "@/hooks";
import { useSubscriptionDataTableView } from "@/vash/dashboard/subscription/hooks";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  search?: string;
  onSearch?: (term: string) => void;
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
  onSearch,
}: DataTableProps<TData, TValue>) {
  //** Filter states */
  const [filterInput, setFilterInput] = useState<string>("");
  const [currentStatus, setCurrentStatus] = useState("all");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const debounce_term = useDebounce(filterInput, 400);

  //** Visible Columns */
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  //* hook mobile view
  const isMobile = useIsMobile();

  //* Hook view datatable
  useSubscriptionDataTableView({ isMobile, columns, setColumnVisibility });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    /* Filter */
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnVisibility,
      columnFilters,
    },
  });
  const inputEmail = table
    .getColumn("account_email")
    ?.getFilterValue() as string;

  const handleStatusSelect = useCallback((value: string) => {
    if (value === "all") {
      table.getColumn("status")?.setFilterValue(undefined);
      setCurrentStatus("all");
      return;
    }
    table.getColumn("status")?.setFilterValue(value);
    setCurrentStatus(value);
  }, []);

  const handleAccountInput = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setCurrentStatus("all");
      table.getColumn("status")?.setFilterValue(undefined);
      table.getColumn("account_email")?.setFilterValue(event.target.value);
      setFilterInput(event.target.value);
    },
    [table]
  );

  useEffect(() => {
    onSearch && onSearch(debounce_term);
  }, [debounce_term]);

  return (
    <>
      <div className="flex flex-col sm:grid sm:grid-cols-4 items-center py-4 justify-between">
        <div className="w-full my-2">
          <InputSubscriptionEmailFilter
            value={inputEmail}
            onChangeFilter={handleAccountInput}
          />
        </div>

        <div className="w-full my-2">
          <SelectStatusFilter
            status={currentStatus}
            onStatusSelectChange={handleStatusSelect}
          />
        </div>

        <div className={`w-full`}></div>

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

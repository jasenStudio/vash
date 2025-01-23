"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  VisibilityState,

  /* Sorting */
  SortingState,

  /* Filter */
  ColumnFiltersState,
  getFilteredRowModel,

  /* Pagination */
  getPaginationRowModel,
  getSortedRowModel,
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

import {
  InputSubscriptionEmailFilter,
  SelectStatusFilter,
  PaginationLimitControl,
  PaginationInput,
} from "..";

import { Button } from "@/components/ui/button";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useDebounce, useIsMobile } from "@/hooks";
import { useSubscriptionDataTableView } from "@/vash/dashboard/subscription/hooks";
import { UseQueryResult } from "@tanstack/react-query";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  search?: string;
  onSearch?: (term: string) => void;

  subscriptionsQuery?: UseQueryResult<any, Error>;

  //** Paginations */
  limitSubscription: number;
  page: number;
  totalPages: number;
  onNextPage: () => void;
  onPrevPage: () => void;
  onSetPage: (page: number) => void;
  onLimitSubscription: (limit: number) => void;
}

const sizePages = [5, 10, 15, 20, 25, 50, 100];

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
  subscriptionsQuery,
  limitSubscription,
  page,
  totalPages,
  onNextPage,
  onPrevPage,
  onSetPage,
  onLimitSubscription,
}: DataTableProps<TData, TValue>) {
  //* Selection State */
  const [rowSelection, setRowSelection] = useState({});

  //* Sorting sTATE */
  const [sorting, setSorting] = useState<SortingState>([]);

  //** Filter states */
  const [filterInput, setFilterInput] = useState<string>("");
  const [currentStatus, setCurrentStatus] = useState("all");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const debounce_term = useDebounce(filterInput, 400);

  //** Visible Columns State */
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

    /* Row Selection */
    onRowSelectionChange: setRowSelection,

    /* Sorting  */
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),

    /* Filter */
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),

    /*Pagination */
    getPaginationRowModel: getPaginationRowModel(),

    state: {
      rowSelection,
      sorting,
      columnVisibility,
      columnFilters,
    },
  });

  const rowsSelected = table.getFilteredSelectedRowModel().rows.length;
  const rowsFiltered = table.getFilteredRowModel().rows.length;

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

        {/* paginationTable */}
        <div className="w-full grid grid-cols-1 place-content-center place-items-center sm:grid-cols-1 md:grid-cols-2">
          <div className="w-full flex flex-row justify-between items-center px-2">
            <PaginationLimitControl
              rowsSelected={rowsSelected}
              rowsFiltered={rowsFiltered}
              sizePages={sizePages}
              limitedItems={limitSubscription}
              onLimit={onLimitSubscription}
              onPageSize={table.setPageSize}
            />
          </div>

          <div className="w-full flex flex-col sm:flex-row justify-center items-center px-2">
            <div className="flex flex-1 justify-end items-center">
              {" "}
              <Button
                className="text-[16px] [&_svg]:size-6  "
                variant="outline"
                disabled={page === 1}
                onClick={() => {
                  onPrevPage();
                }}
              >
                {isMobile ? <ArrowBigLeft /> : "Previous"}
              </Button>
              <div className="flex items-center justify-center">
                <span style={{ fontSize: 18 }}>
                  {page} of {totalPages}
                </span>
              </div>
              <Button
                className="text-[16px] [&_svg]:size-6 "
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => {
                  onNextPage();
                }}
              >
                {isMobile ? <ArrowBigRight /> : "Next"}
              </Button>
            </div>{" "}
            <div className="flex flex-1 items-center">
              <PaginationInput
                currentPage={page}
                totalPages={totalPages}
                onChange={onSetPage}
              />{" "}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

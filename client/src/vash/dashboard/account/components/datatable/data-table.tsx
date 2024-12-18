import { ChangeEvent, useEffect, useState } from "react";
import { ColumnDef, flexRender } from "@tanstack/react-table";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
import { Input } from "@/components/ui/input";

import { Account } from "./columns";
import { UseQueryResult } from "@tanstack/react-query";
import { PaginationInput } from "..";

import { useDebounce, useIsMobile } from "@/hooks";
import { ArrowBigLeft, ArrowBigRight, Trash } from "lucide-react";

import {
  useAccountDataTablemobile,
  useAccountDataTable,
} from "@/vash/dashboard/account/hooks";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  limitAccount: number;
  accountsQuery?: UseQueryResult<any, Error>;
  page: number;
  totalPages: number;
  onLimitAccount: (limit: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  onSetPage: (page: number) => void;
  search?: string;
  onSearch?: (term: string) => void;
}

const sizePages = [5, 10, 15, 20, 25, 50, 100];

export function DataTable<TData, TValue>({
  columns,
  data,
  limitAccount,
  accountsQuery,
  page,
  totalPages,
  onLimitAccount,
  nextPage,
  prevPage,
  onSetPage,
  onSearch,
}: DataTableProps<TData, TValue>) {
  const [filterInput, setFilterInput] = useState("");
  const [currentStatus, setCurrentStatus] = useState("all");
  const { table, rowSelection, setColumnVisibility } = useAccountDataTable({
    data,
    columns,
  });
  const isMobile = useIsMobile();
  const isDeleteRecord = Object.keys(rowSelection).length > 0;
  const rowsSelected = table.getFilteredSelectedRowModel().rows.length;
  const debounce_term = useDebounce(filterInput, 400);
  const rows_generated = table.getRowModel().rows.length;
  const [messageInfo, setMessageInfo] = useState("");
  useAccountDataTablemobile({ isMobile, columns, setColumnVisibility });

  const handleAccountInput = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentStatus("all");
    table.getColumn("status")?.setFilterValue(undefined);
    table.getColumn("account_email")?.setFilterValue(event.target.value);
    setFilterInput(event.target.value);
  };

  useEffect(() => {
    onSearch && onSearch(debounce_term);
  }, [debounce_term]);

  useEffect(() => {
    if (accountsQuery!.isFetching) {
      setMessageInfo("Searching...");
    } else {
      const handler = setTimeout(() => {
        if (rows_generated === 0) {
          setMessageInfo("No results");
        }
      }, 1000);

      return () => clearTimeout(handler);
    }
    return () => setMessageInfo("");
  }, [rows_generated, debounce_term, accountsQuery?.isFetching]);

  return (
    <>
      <div className="flex flex-col sm:grid sm:grid-cols-4 items-center py-4 justify-between">
        {/* account_email */}
        <div className="w-full my-2">
          {" "}
          <Input
            placeholder="Filter emails..."
            value={
              (table.getColumn("account_email")?.getFilterValue() as string) ??
              ""
            }
            onChange={handleAccountInput}
            className="max-w-sm"
          />
        </div>

        {/* status */}
        <div className="w-full my-2">
          {" "}
          <Select
            value={currentStatus}
            onValueChange={(value) => {
              console.log(value);
              if (value === "all") {
                table.getColumn("status")?.setFilterValue(undefined);
                setCurrentStatus("all");
                return;
              }
              setCurrentStatus(value);
              table.getColumn("status")?.setFilterValue(value);
              console.log(table.getColumn("status")?.setFilterValue(value));
            }}
          >
            <SelectTrigger
              className={`${isMobile ? "w-full" : " w-[180px]"} ml-2`}
            >
              <SelectValue placeholder="Status - Active" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>status</SelectLabel>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* deleteButton */}
        <div className={`w-full ${isDeleteRecord && "my-2"}`}>
          {isDeleteRecord ? (
            <Button
              className={`${isMobile ? "w-full" : ""}`}
              variant="destructive"
              onClick={() => {
                let ids: number[] = [];
                table.getSelectedRowModel().rows.map((row) => {
                  console.log((row.original as Account).account_email);
                  ids.push(+(row.original as Account).id);
                });
                console.log(rowSelection);
                console.log(ids, "aqui");
                console.log(ids[0]);
              }}
            >
              <Trash />
              delete {rowsSelected > 1 ? "accounts" : "account"}
              <span>({rowsSelected})</span>
            </Button>
          ) : (
            <span></span>
          )}
        </div>

        {/* columsVisible */}
        <div className="w-full my-2">
          {" "}
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className={`${isMobile ? "w-full" : ""}`}
            >
              <Button variant="outline" className="ml-auto">
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  const columName =
                    column.id === "account_email" ? "email" : column.id;
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
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

      {/* table */}
      <div className="rounded-md border">
        {/* table body */}
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
            {accountsQuery!.isPending ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : accountsQuery!.isError ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center text-red-500"
                >
                  Error fetching data.
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
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
                <TableCell colSpan={columns.length} className="text-center">
                  {messageInfo}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* paginationTable */}
        <div className="w-full grid grid-cols-1 place-content-center place-items-center sm:grid-cols-1 md:grid-cols-2">
          <div className="w-full flex flex-row justify-between items-center px-2">
            <div className="flex-1 text-sm text-muted-foreground my-5">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>

            <Select
              value={`${limitAccount}`}
              onValueChange={(value) => {
                table.setPageSize(+value);
                onLimitAccount(+value);
              }}
            >
              <SelectTrigger className="w-[180px] m-2">
                <SelectValue placeholder={`${limitAccount}`} />
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
          </div>

          <div className="w-full flex flex-col sm:flex-row justify-center items-center px-2">
            <div className="flex flex-1 justify-end items-center">
              {" "}
              <Button
                className="text-[16px] [&_svg]:size-6  "
                variant="outline"
                disabled={page === 1}
                onClick={() => {
                  prevPage();
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
                  nextPage();
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

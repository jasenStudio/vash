import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  SortingState,
  getSortedRowModel,
  VisibilityState,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";

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

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Account } from "./columns";
import { UseQueryResult } from "@tanstack/react-query";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  limitAccount: number;
  accountsQuery: UseQueryResult<any, Error>;
  page: number;
  totalPages: number;
  onLimitAccount: (limit: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  onSelectPage: (pageSelect: number) => void;
}

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
  onSelectPage,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [currentStatus, setCurrentStatus] = useState("all");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [inputSelectPage, setInputSelectpage] = useState(false);
  // const [lastTap, setLastTap] = useState(0);

  const isDeleteRecord = Object.keys(rowSelection).length > 0;

  // const handleTouchEnd = () => {
  //   const currentTime = Date.now();
  //   const tapGap = currentTime - lastTap;

  //   if (tapGap < 300 && tapGap > 0) {
  //     console.log("Doble toque detectado");
  //     // Aquí va la lógica del doble toque
  //   }

  //   setLastTap(currentTime);
  // };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      rowSelection,
      columnVisibility,
      columnFilters,
    },
  });

  return (
    <>
      <div className="flex items-center py-4 justify-between">
        {/* account_email */}

        <Input
          placeholder="Filter emails..."
          value={
            (table.getColumn("account_email")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) => {
            setCurrentStatus("all");
            table.getColumn("status")?.setFilterValue(undefined);

            table
              .getColumn("account_email")
              ?.setFilterValue(event.target.value);
            console.log(event.target.value);
          }}
          className="max-w-sm"
        />

        {/* status */}
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
          <SelectTrigger className="w-[180px] ml-2">
            <SelectValue placeholder="Status - Active" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>status</SelectLabel>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {isDeleteRecord ? (
          <Button
            className="ml-2 "
            variant="destructive"
            onClick={() => {
              // table.getSelectedRowModel().rows.forEach((row) => {
              //   console.log(row.original);
              // });
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
            delete
          </Button>
        ) : (
          <span></span>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
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
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {columName}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
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
            {/* {table.getRowModel().rows?.length ? (
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
            )} */}

            {accountsQuery.isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : accountsQuery.isError ? (
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div>
          <div className="flex-1 text-sm text-muted-foreground my-5">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex items-center justify-end space-x-2 py-4 mx-2">
            <Button
              variant="outline"
              size="sm"
              // onClick={prevPage}
              disabled={page === 1}
              onClick={() => {
                prevPage();
              }}
              // disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <div className="flex items-center justify-center">
              {inputSelectPage ? (
                <Input
                  type="number"
                  value={page}
                  min={1}
                  max={totalPages}
                  onInput={(e) => {
                    const value = +e.currentTarget.value;
                    if (value >= 1 && value <= totalPages) {
                      onSelectPage(value);
                    }
                  }}
                  onBlur={() => setInputSelectpage(false)} // Cierra el input al perder el foco
                  className="w-16 text-center"
                />
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInputSelectpage(true)}
                >
                  {page}
                </Button>
              )}
              <span className="mx-2">of {totalPages}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => {
                nextPage();
              }}
              // disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>

        <Select
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
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectGroup>
            </SelectContent>
          </SelectTrigger>
        </Select>
      </div>
    </>
  );
}

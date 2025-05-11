import { ChangeEvent, useCallback, useEffect, useState } from "react";

import { ColumnDef, flexRender } from "@tanstack/react-table";

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

import { Account } from "./columns";
import { UseQueryResult } from "@tanstack/react-query";

import { useDebounce, useIsMobile } from "@/hooks";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";

import {
  useAccountDataTablemobile,
  useAccountDataTable,
} from "@/vash/dashboard/account/hooks";

import {
  SelectStatusFilter,
  PaginationInput,
  InputAccountEmailFilter,
  FormAccountDialog,
  ButtonDeleteAccount,
  ButtonCreateAccount,
} from "..";

import { useDialog } from "@/vash/store/ui/useDialog";

import { AlertDialogAccount } from "../AlertDialogAccount/AlertDialogAccount";
import { PaginationLimitControl } from "./PaginationComponents/PaginationLimitControls/PaginationLimitControl";
import { Hourglass } from "react-loader-spinner";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const [filterInput, setFilterInput] = useState("");
  const [currentStatus, setCurrentStatus] = useState("all");

  const { table, rowSelection, setColumnVisibility } = useAccountDataTable({
    data,
    columns,
  });
  const isMobile = useIsMobile();
  const isDeleteRecord = Object.keys(rowSelection).length > 1;
  const debounce_term = useDebounce(filterInput, 400);
  const rowsSelected = table.getFilteredSelectedRowModel().rows.length;
  const rowsFiltered = table.getFilteredRowModel().rows.length;
  const rows_generated = table.getRowModel().rows;
  const [messageInfo, setMessageInfo] = useState("");

  //** Dialog Component */
  const onOpen = useDialog((state) => state.onOpen);
  const isOpen = useDialog((state) => state.isOpen);
  const typeComponent = useDialog((state) => state.typeComponent);
  const setData = useDialog((state) => state.setData);

  //* View columns table for desktop and mobile
  useAccountDataTablemobile({ isMobile, columns, setColumnVisibility });

  const inputEmail = table
    .getColumn("account_email")
    ?.getFilterValue() as string;

  const handleAccountInput = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setCurrentStatus("all");
      table.getColumn("status")?.setFilterValue(undefined);
      table.getColumn("account_email")?.setFilterValue(event.target.value);
      setFilterInput(event.target.value);
    },
    [table]
  );

  const handleStatusSelect = useCallback((value: string) => {
    if (value === "all") {
      table.getColumn("status")?.setFilterValue(undefined);
      setCurrentStatus("all");
      return;
    }
    table.getColumn("status")?.setFilterValue(value);
    setCurrentStatus(value);
  }, []);

  const handleDeleteButton = useCallback(() => {
    let ids: number[] = [];
    table.getSelectedRowModel().rows.map((row) => {
      ids.push(+(row.original as Account).id);
    });
    setData(ids);
    onOpen("alert", "account", "delete");
  }, [setData, onOpen]);

  useEffect(() => {
    onSearch && onSearch(debounce_term);
  }, [debounce_term]);

  useEffect(() => {
    if (accountsQuery!.isFetching) {
      setMessageInfo("Searching...");
    } else if (rows_generated.length === 0) {
      setMessageInfo("No results");
    } else {
      setMessageInfo("");
    }
  }, [accountsQuery!.isFetching, rows_generated, debounce_term]);

  return (
    <>
      <div className="flex flex-col sm:grid sm:grid-cols-4 items-center py-4 justify-between">
        {/**  filters account_email status */}

        <InputAccountEmailFilter
          value={inputEmail}
          onChangeFilter={handleAccountInput}
        />

        <SelectStatusFilter
          status={currentStatus}
          onStatusSelectChange={handleStatusSelect}
        />

        {/* deleteButton */}
        <div className={`w-full ${isDeleteRecord && "my-2"}`}>
          {isDeleteRecord ? (
            <ButtonDeleteAccount
              isDeleteRecord={isDeleteRecord}
              onHandleDelete={handleDeleteButton}
              rowsSelected={rowsSelected}
            />
          ) : (
            <span></span>
          )}
        </div>

        {/* columsVisible */}
        <div className="w-full my-2">
          {" "}
          <ButtonCreateAccount onOpen={onOpen} />
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className={`${isMobile ? "w-full" : ""}`}
            >
              <Button variant="outline" className="ml-auto">
                {t("common.columns")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              className={`${isMobile && "min-w-[18rem]"}`}
            >
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  const columName =
                    column.id === "account_email" ? "email" : column.id;
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
                <TableCell
                  // colSpan={columns.length}
                  colSpan={columns.length}
                  className="text-center "
                >
                  <div className="w-full  flex justify-center items-center">
                    {" "}
                    <Hourglass
                      visible={true}
                      height="30"
                      width="30"
                      ariaLabel="hourglass-loading"
                      wrapperStyle={{}}
                      wrapperClass="my-2"
                      colors={["#306cce", "#72a1ed"]}
                    />
                  </div>
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
                <TableRow
                  key={row.id}
                  className="transition-all ease-in-out duration-300"
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
            <PaginationLimitControl
              rowsSelected={rowsSelected}
              rowsFiltered={rowsFiltered}
              sizePages={sizePages}
              limitedAccount={limitAccount}
              onLimitAccount={onLimitAccount}
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

      <FormAccountDialog />

      {isOpen && typeComponent === "alert" && <AlertDialogAccount />}
    </>
  );
}

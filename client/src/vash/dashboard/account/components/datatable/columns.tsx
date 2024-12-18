import { ColumnDef, SortDirection, Row, FilterFn } from "@tanstack/react-table";
import { ChevronDownIcon, ChevronUpIcon, MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export type Account = {
  id: string;
  account_email: string;
  status: string;
  created_at: string;
};

const myCustomFilterFn: FilterFn<Account> = (
  row: Row<Account>,
  columnId: string,
  filterValue: any,
  addMeta: (meta: any) => void
) => {
  filterValue = filterValue.toLowerCase();
  const filterParts = filterValue.split(" ");

  const rowValues =
    `${row.original.account_email} ${row.original.status}`.toLowerCase();

  return filterParts.every((part: string) => rowValues.includes(part));

  // if (row.original.email.includes(filterValue)) {
  //   return true;
  // }

  // if (row.original.clientName.includes(filterValue)) {
  //   return true;
  // }

  // if (row.original.status.includes(filterValue)) {
  //   return true;
  // }

  // return false;
};

const SortedIcon = ({ isSorted }: { isSorted: false | SortDirection }) => {
  if (isSorted === "asc") {
    return <ChevronUpIcon className="h-4 w-4" />;
  }

  if (isSorted === "desc") {
    return <ChevronDownIcon className="h-4 w-4" />;
  }

  return null;
};

export const columns: ColumnDef<Account>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        style={{
          margin: "10px 0" /* Espacio entre la selección y la tabla */,
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        style={{
          margin: "10px 0" /* Espacio entre la selección y la tabla */,
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      />
    ),
    enableSorting: false,
    enableHiding: true,
  },
  {
    id: "account_email",
    accessorKey: "account_email",
    filterFn: myCustomFilterFn,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <SortedIcon isSorted={column.getIsSorted()} />
        </Button>
      );
    },
  },
  {
    id: "status",
    accessorKey: "status",
    header: "status",
    filterFn: myCustomFilterFn,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      return <div className="text-right font-medium">{status}</div>;
    },
  },
  {
    id: "created_at",
    accessorKey: "created_at",
    header: "created_at",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

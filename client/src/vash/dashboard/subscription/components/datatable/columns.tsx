import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef, SortDirection } from "@tanstack/react-table";
import { ChevronDownIcon, ChevronUpIcon, MoreHorizontal } from "lucide-react";
import { t } from "i18next";
import MenuActions from "./MenuActions/MenuActions";
import { ColumnStatus } from "./columns/status/ColumnStatus";
export type Subcription = {
  account_email: string;
  account_id: number;
  id: number;
  name_service: string;
  services_id: number;
  status: boolean;
  user_name_subscription: null | string;
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

export const columns: ColumnDef<Subcription>[] = [
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
    id: "name_service",
    accessorKey: "name_service",
    header: "services",
  },
  {
    id: "user_name_subscription",
    accessorKey: "user_name_subscription",
    header: "Username",
  },
  {
    id: "status",
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      return <ColumnStatus status={status} />;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const subscription = row.original;

      return (
        <>
          <MenuActions subscription={subscription} />
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem> {t("common.ViewDetails")}</DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e: any) => {
                  e.stopPropagation();
                }}
              >
                {t("entities.subscriptions.update")}
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={(e: any) => {
                  e.stopPropagation();
                  console.log(subcription.id);
                }}
              >
                {t("entities.subscriptions.delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </>
      );
    },
  },
];

import { Button } from "@/components/ui/button";
import { useTitle } from "@/hooks/use-title";
import { useAuthStore } from "@/vash/store/auth/useAuthStore";
import { format, compareAsc } from "date-fns";
import { Link } from "react-router-dom";
import { es } from "date-fns/locale";
import { columns, Account } from "../components/datatable/columns";
import { DataTable } from "../components/datatable/data-table";
import { useAccounts } from "../hooks/use-accounts";
import { Account as AccountInterface } from "@/domain";
import { useState } from "react";

export const ListAccountPage = () => {
  const logout = useAuthStore((state) => state.logout);

  useTitle("lista de cuentas");
  const [limitAccount, setlimitAccount] = useState<number>(10);
  const {
    accountsQuery,
    accounts,
    nextPage,
    prevPage,
    page,
    totalPages,
    SelectPage,
  } = useAccounts({
    limit: limitAccount,
  });

  const accountsMap = accounts.map((account: AccountInterface) => {
    const { account_email, created_at, status, ...rest } = account;
    return {
      account_email: account_email,
      created_at: format(new Date(Date.parse(created_at)), "dd-MM-uuu", {
        locale: es,
      }),
      status: `${status}`,
      ...rest,
    };
  });

  return (
    <div>
      ListAccountPage
      <Button
        onClick={() => {
          logout();
        }}
      >
        LOGOUT
      </Button>
      <Link to="/accounts/show">Show</Link>
      <div className="container mx-auto py-10">
        <DataTable
          accountsQuery={accountsQuery}
          columns={columns}
          data={accountsMap}
          onLimitAccount={setlimitAccount}
          limitAccount={limitAccount}
          nextPage={nextPage}
          prevPage={prevPage}
          page={page}
          totalPages={totalPages}
          onSelectPage={SelectPage}
        />
      </div>
    </div>
  );
};

import { useTitle } from "@/hooks/use-title";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { columns } from "../components/datatable/columns";
import { DataTable } from "../components/datatable/data-table";
import useAccounts from "../hooks/use-accounts";
import { Account as AccountInterface } from "@/domain";
import { useState } from "react";

const ListAccountPage = () => {
  useTitle("lista de cuentas");
  const [limitAccount, setlimitAccount] = useState<number>(5);
  const [search, setSearch] = useState<string>("");
  const {
    accountsQuery,
    accounts,
    nextPage,
    prevPage,
    page,
    totalPages,
    setPage,
  } = useAccounts({
    limit: limitAccount,
    search,
  });

  const accountsMap = accounts.map((account: AccountInterface) => {
    const { account_email, created_at, status, ...rest } = account;
    return {
      account_email: account_email,
      created_at: format(new Date(Date.parse(created_at)), "dd-MM-uuu", {
        locale: es,
      }),
      status: `${status ? "Active" : "Inactive"}`,
      ...rest,
    };
  });

  return (
    <div>
      <div className="container mx-auto py-10">
        <DataTable
          accountsQuery={accountsQuery}
          columns={columns}
          data={accountsMap}
          limitAccount={limitAccount}
          nextPage={nextPage}
          onLimitAccount={setlimitAccount}
          onSetPage={setPage}
          page={page}
          prevPage={prevPage}
          totalPages={totalPages}
          onSearch={setSearch}
        />
      </div>
    </div>
  );
};

export default ListAccountPage;

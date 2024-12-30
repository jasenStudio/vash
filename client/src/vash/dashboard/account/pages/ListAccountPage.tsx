import { useTitle } from "@/hooks/use-title";
import { columns } from "../components/datatable/columns";
import { DataTable } from "../components/datatable/data-table";
import useAccounts from "../hooks/use-accounts";

import { useMemo, useState } from "react";
import { Account } from "@/domain";

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

  const accountsMap = useMemo(() => {
    return accounts.map((account: Account) => {
      const { account_email, created_at, status, ...rest } = account;
      return {
        account_email,
        created_at: String(created_at),
        status: `${status ? "true" : "false"}`,
        ...rest,
      };
    });
  }, [accounts]);

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

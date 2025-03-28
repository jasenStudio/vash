import { useQuery } from "@tanstack/react-query";
import { AccountService } from "../services/account.services";
import { useEffect, useState } from "react";
import { usePaginationStore } from "@/vash/store/ui/usePaginationStore";
import { useAccountStore } from "@/vash/store";
import { Account } from "@/domain";
import { ActionsAccount } from "@/vash/store/account/useAccountStore";

interface Props {
  limit: number;
  search?: string;
}

const useAccounts = ({ limit, search = "" }: Props) => {
  const {
    setPage: setPageStore,
    setLimit,
    setSearch,
    setTotal,
  } = usePaginationStore((state) => state);

  const records = useAccountStore((state) => state.records);
  const actionRecords = useAccountStore((state) => state.actionsCrud);

  const [page, setPage] = useState(1);

  const accountsQuery = useQuery({
    queryKey: ["accounts", { page, limit, search }],
    queryFn: () => AccountService.index(page, limit, search),
    staleTime: 1000 * 60 * 60,
    placeholderData: (previousData) => previousData,
    select: (data) => {
      if (data.meta.page !== 1 && records.size > 0) {
        if (actionRecords === ActionsAccount.create) {
          data.data.accounts = data.data.accounts.map((account: Account) => {
            const accountId = String(account.id);

            const foundKey = [...records.entries()].find(
              ([, value]) => value.overridingAccountId === accountId
            )?.[0];

            if (foundKey) {
              const newAccount = records.get(foundKey);
              records.delete(foundKey);
              return newAccount;
            }

            return account;
          });
        }

        if (actionRecords === ActionsAccount.delete) {
          data.data.accounts = data.data.accounts.filter((account: Account) => {
            const accountId = String(account.id);

            // Verifica si el registro existe en `records`
            if (records.has(accountId)) {
              // Si existe, elimínalo del Map
              records.delete(accountId);
              // Retorna false para eliminarlo del array
              return false;
            }

            // Si no existe, mantén el elemento en el array
            return true;
          });
        }
      }
      return data;
    },
  });

  const { data } = accountsQuery;
  const accounts = data?.data.accounts ?? [];
  const totalPages = data?.meta.totalPages ?? 1;

  useEffect(() => {
    setPage(1);
    setPageStore(page);
    setLimit(limit);
    setSearch(search);
  }, [limit, search]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }

    setTotal(totalPages);
  }, [totalPages]);

  const nextPage = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  return {
    accountsQuery,
    accounts,
    page,
    totalPages,
    prevPage,
    nextPage,
    setPage,
  };
};

export default useAccounts;

import { useQuery } from "@tanstack/react-query";
import { AccountService } from "../services/account.services";
import { useEffect, useState } from "react";
import { usePaginationStore } from "@/vash/store/ui/usePaginationStore";
import { AccountsResponse } from "@/infrastructure/interfaces/account.response";
import { useAccountStore } from "@/vash/store";

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

  const [page, setPage] = useState(1);

  const accountsQuery = useQuery({
    queryKey: ["accounts", { page, limit, search }],
    queryFn: () => AccountService.index(page, limit, search),
    staleTime: 1000 * 60 * 60,
    placeholderData: (previousData) => previousData,
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

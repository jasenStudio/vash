import { useQuery } from "@tanstack/react-query";
import { AccountService } from "../services/account.services";
import { useEffect, useState } from "react";
import { usePagination } from "@/vash/store/ui/usePagination";

interface Props {
  limit: number;
  search?: string;
}

const useAccounts = ({ limit, search = "" }: Props) => {
  const {
    setPage: setPageStore,
    setLimit,
    setSearch,
  } = usePagination((state) => state);
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

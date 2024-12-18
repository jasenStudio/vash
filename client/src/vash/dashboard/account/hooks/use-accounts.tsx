import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AccountService } from "../services/account.services";
import { useEffect, useState } from "react";

interface Props {
  limit: number;
  search?: string;
}

export const useAccounts = ({ limit, search = "" }: Props) => {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const accountsQuery = useQuery({
    queryKey: ["accounts", { page, limit, search }],
    queryFn: () => AccountService.index(page, limit, search),
    staleTime: 1000 * 60 * 60,
    placeholderData: (previousData, previousQuery) => previousData,
  });

  const { data } = accountsQuery;
  const accounts = data?.data.accounts ?? [];
  const totalPages = data?.meta.totalPages ?? 1;

  useEffect(() => {
    setPage(1);
  }, [limit, search]);

  const nextPage = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
      return;
    }
  };

  const SelectPage = (pageSelect: number) => {
    if (pageSelect > totalPages) return;
    if (pageSelect < 1) return;
    setPage(pageSelect);
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
    SelectPage,
    setPage,
  };
};

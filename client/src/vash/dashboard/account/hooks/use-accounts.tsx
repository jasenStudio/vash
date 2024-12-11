import { useQuery } from "@tanstack/react-query";
import { AccountService } from "../services/account.services";
import { useEffect, useState } from "react";

interface Props {
  limit: number;
}

export const useAccounts = ({ limit }: Props) => {
  const [page, setPage] = useState(1);

  const accountsQuery = useQuery({
    queryKey: ["accounts", { page, limit }],
    queryFn: () => AccountService.index(page, limit),
    staleTime: 1000 * 60 * 60,
  });
  const { data } = accountsQuery;
  const accounts = data?.data.accounts ?? [];
  const totalPages = data?.meta.totalPages ?? 1;

  useEffect(() => {
    setPage(1);
  }, [limit]);

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
  };
};

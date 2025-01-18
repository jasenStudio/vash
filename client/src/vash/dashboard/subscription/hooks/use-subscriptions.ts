import { useQuery } from "@tanstack/react-query";
import { SubscriptionService } from "../services/subscription.services";
import { useEffect, useState } from "react";

interface Props {
  limit: number;
  search?: string;
}

const useSubscriptions = ({ limit, search = "" }: Props) => {
  const [page, setPage] = useState(1);
  const subscriptionsQuery = useQuery({
    queryKey: ["subscriptions", { page, limit, search }],
    queryFn: () => SubscriptionService.index(page, limit, search),
    staleTime: 1000 * 60 * 60,
    placeholderData: (previousData) => previousData,
  });
  const { data } = subscriptionsQuery;
  const subscriptions = data?.data.subscriptions ?? [];
  const totalPages = data?.meta.totalPages ?? 1;

  useEffect(() => {
    setPage(1);
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
    subscriptionsQuery,
    subscriptions,
    page,
    totalPages,
    prevPage,
    nextPage,
    setPage,
  };
};

export default useSubscriptions;

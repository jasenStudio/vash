import { useQuery } from "@tanstack/react-query";
import { SubscriptionService } from "../services/subscription.services";

const useSubscriptions = () => {
  const subscriptionsQuery = useQuery({
    queryKey: ["subscriptions"],
    queryFn: SubscriptionService.index,
    staleTime: 1000 * 60 * 60,
  });
  const { data } = subscriptionsQuery;
  const subscriptions = data?.data.subscriptions ?? [];
  return { subscriptionsQuery, subscriptions };
};

export default useSubscriptions;

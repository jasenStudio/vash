import { SubscriptionMapper } from "@/infrastructure/mapper/subcription.mapper";
import useSubscriptions from "../hooks/use-subscriptions";
import { useTitle } from "@/hooks/use-title";
import { DataTable } from "../components/datatable/data-table";
import { columns } from "../components/datatable/columns";
import { subscriptionResponse } from "@/infrastructure/interfaces/subscription.response";
import { useState } from "react";
const ListSubscriptionPage = () => {
  const [search, setSearch] = useState<string>("");
  const [LimitSusbcription, _setlimitSubscription] = useState<number>(5);

  const { subscriptions } = useSubscriptions({
    limit: LimitSusbcription,
    search: search,
  });
  useTitle("lista de subscriptions");

  const subscriptionsMapper = subscriptions.map((sub: subscriptionResponse) => {
    const { status, ...rest } = SubscriptionMapper.SubcriptionToEntity(sub);
    return {
      status: `${status ? "true" : "false"}`,
      ...rest,
    };
  });

  return (
    <div className="container mx-auto py-10">
      <DataTable
        columns={columns}
        data={subscriptionsMapper}
        onSearch={setSearch}
        search={search}
      />
    </div>
  );
};

export default ListSubscriptionPage;

import { vashApi } from "@/api/vashApi";
import { ErrorMapper } from "@/infrastructure/mapper/error.mapper";

export class SubscriptionService {
  static index = async () => {
    const URL = "/subcription";

    try {
      const { data } = await vashApi.get(URL);

      return data;
    } catch (error) {
      ErrorMapper.handleError(error, "Opss, you can't load subscriptions");
    }
  };
}

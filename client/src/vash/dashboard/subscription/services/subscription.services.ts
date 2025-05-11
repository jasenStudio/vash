import { vashApi } from "@/api/vashApi";
import { ErrorMapper } from "@/infrastructure/mapper/error.mapper";

export class SubscriptionService {
  static index = async (page: number = 1, limit: number = 5, search = "") => {
    const URL = `/subcription?limit=${limit}&page=${page}&search=${search}`;

    try {
      const { data } = await vashApi.get(URL);
      console.log(data);
      return data;
    } catch (error) {
      ErrorMapper.handleError(error, "Opss, you can't load subscriptions");
    }
  };
}

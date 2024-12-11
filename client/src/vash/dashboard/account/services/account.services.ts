import { vashApi } from "@/api/vashApi";
import { AxiosError } from "axios";

export class AccountService {
  static index = async (page: number = 1, limit: number = 5) => {
    try {
      const { data } = await vashApi.get(
        `/accounts?limit=${limit}&page=${page}`
      );
      console.log(data.data);
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data);
        throw new Error(JSON.stringify(error.response?.data));
      }
      // console.log(error);
      throw new Error("Upss no workings accounts");
    }
  };
}

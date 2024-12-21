import { vashApi } from "@/api/vashApi";
import { AxiosError } from "axios";

const _sleep = async () => {
  return new Promise((r) => setTimeout(r, 4000));
};
export class AccountService {
  static index = async (page: number = 1, limit: number = 5, search = "") => {
    const URL = `/accounts?limit=${limit}&page=${page}&search=${search}`;

    try {
      const { data } = await vashApi.get(URL);
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

  static store = async (account_email: string) => {
    const URL = "/accounts/new";

    try {
      await _sleep();
      const { data } = await vashApi.post(URL, { account_email });
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data);
        throw new Error(JSON.stringify(error.response?.data));
      }
      throw new Error("Ops , you can't create account");
    }
  };
}

import { vashApi } from "@/api/vashApi";
import { Account } from "@/domain";

import { ErrorMapper } from "@/infrastructure/mapper/error.mapper";
import { AxiosError } from "axios";

export interface Props {
  id: number;
  payload: Omit<Partial<Account>, "id">;
}
// const _sleep = async () => {
//   return new Promise((r) => setTimeout(r, 4000));
// };
export class AccountService {
  static index = async (page: number = 1, limit: number = 5, search = "") => {
    const URL = `/accounts?limit=${limit}&page=${page}&search=${search}`;

    try {
      const { data } = await vashApi.get(URL);
      console.log(data.data);
      return data;
    } catch (error) {
      //* TODO : Implementar el error mapper
      if (error instanceof AxiosError) {
        console.log(error.response?.data);
        throw new Error(JSON.stringify(error.response?.data));
      }

      throw new Error("Upss no workings accounts");
    }
  };

  static store = async (account_email: string) => {
    const URL = "/accounts/new";

    try {
      const { data } = await vashApi.post(URL, { account_email });
      return data;
    } catch (error) {
      ErrorMapper.handleError(error, "Ops , you can't create account");
    }
  };

  static update = async ({ id, payload }: Props) => {
    const URL = `/accounts/edit/${id}`;
    const { created_at, ...rest } = payload;
    console.log(payload);
    try {
      const { data } = await vashApi.put(URL, rest);
      return data;
    } catch (error) {
      throw ErrorMapper.handleError(error, "Ops , you can't update account");
    }
  };
}

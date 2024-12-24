import { AxiosError } from "axios";

export class ErrorMapper {
  static handleError(error: unknown, message: string) {
    if (error instanceof AxiosError) {
      if (error.code === "ERR_NETWORK") {
        throw new Error("503 Service Unavailable");
      }
      throw this.errorToEntity(error.response?.data);
    }
    throw message;
  }

  static errorToEntity(error: Error) {
    const castingError = error as unknown as {
      message: string;
      ok: boolean;
      statusCode: number;
    };

    return {
      message: castingError.message,
      ok: castingError.ok,
      status_code: castingError.statusCode,
    };
  }
}

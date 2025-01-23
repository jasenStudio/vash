import { AxiosError } from "axios";

export class ErrorMapper {
  static handleError(error: unknown, message: string) {
    if (error instanceof AxiosError) {
      if (error.code === "ERR_NETWORK") {
        return {
          message: "503 " + error.message || message,
          statusCode: 503,
          error: "Service Unavailable",
        };
      }

      return this.errorToEntity(error.response?.data);
    } else {
      const castingError = error as {
        error?: string;
        message: string;
        statusCode?: number;
      };

      return {
        message: castingError.message || message,
        statusCode: castingError.statusCode,
        error: castingError.error || "Internal Client Error",
      };
    }
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
      statusCode: castingError.statusCode,
    };
  }
}

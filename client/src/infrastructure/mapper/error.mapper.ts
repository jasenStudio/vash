import { AxiosError } from "axios";

interface ErrorCustom {
  error?: string;
  message: string;
  statusCode?: number;
}
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

      return this.errorToEntity({
        message: error.response?.data.message || error.message,
        name: error.name,
        statusCode: error.response?.data.statusCode,
      });
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

  static errorToEntity(error: Error | ErrorCustom) {
    const castingError = error as unknown as {
      message: string;
      ok: boolean;
      statusCode: number;
    };

    return {
      message: castingError.message,
      ok: castingError.ok || false,
      statusCode: castingError.statusCode || 500,
    };
  }
}

export class ErrorMapper {
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

// src/filters/prisma-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Response } from 'express';
// import { PrismaErrorMessages } from '../constants/prisma-error-codes';

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    console.log(exception.code);
    const { message, statusCode, field } = codeMessage(exception);

    response.status(statusCode).json({
      ok: false,
      statusCode,
      message,
      field,
    });
  }
}

const codeMessage = (exception) => {
  let message;
  let statusCode;
  let field;
  switch (exception.code) {
    case 'P2002':
      statusCode = HttpStatus.BAD_REQUEST;
      field = exception.meta?.target;
      message = `El campo ${field} ya está en uso`;
      break;

    default:
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Error desconocido en la base de datos';
      field = null;
      break;
  }

  return {
    message,
    statusCode,
    field,
  };
};

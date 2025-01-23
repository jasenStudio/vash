// src/filters/prisma-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Request, Response, request } from 'express';
// import { PrismaErrorMessages } from '../constants/prisma-error-codes';

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    //TODO THINKING ABOUT ADD error field in response
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

  console.log(exception);
  switch (exception.code) {
    case 'P2002':
      statusCode = HttpStatus.BAD_REQUEST;
      field = exception.meta?.target;
      message = `El ${field} ya está en uso`;
      break;
    case 'P2025':
      statusCode = HttpStatus.BAD_REQUEST;
      field = exception.meta?.target || '';
      message = `El recurso solicitado no está disponible,no existe o no tiene permiso`;
      break;
    case 'P2003':
      statusCode = HttpStatus.NOT_FOUND;
      field = exception.meta?.target;
      message = `El campo de referencia no existe`;
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

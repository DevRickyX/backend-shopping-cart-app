import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';
    let details: string[] | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        error = exception.message || 'Error';
      } else if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as {
          message?: string | string[];
          error?: string;
        };
        message = Array.isArray(responseObj.message)
          ? responseObj.message[0]
          : responseObj.message || exception.message;
        error = responseObj.error || exception.message || 'Error';
        details = Array.isArray(responseObj.message)
          ? responseObj.message
          : undefined;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      error = 'Error';
    }

    response.status(status).json({
      statusCode: status,
      message,
      error,
      ...(details && { details }),
    });
  }
}


import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    
    const errorResponse = typeof exceptionResponse === 'object'
      ? exceptionResponse
      : {
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          message: exceptionResponse,
        };

    // Log do erro para debug
    console.error(`[HttpException] Path: ${request.url}, Status: ${status}, Error:`, errorResponse);

    response
      .status(status)
      .json({
        ...errorResponse,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}
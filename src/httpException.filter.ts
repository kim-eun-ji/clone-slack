import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { Response } from 'express'
import { stat } from "fs";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter{
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        const err = exception.getResponse() as
            | { message: any, statusCode: number } // custom
            | { error: string; statusCode: 400; message: string[] }; // class-validator의 타입
        
        if (typeof err !== 'string' && err.statusCode === 400) {
            return response.status(status).json({
                success: false,
                code: status,
                data: err.message,
            });
        }

        response.status(status).json({
            success: false,
            code: status,
            data: err.message,
        });

    }

}
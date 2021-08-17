import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger("HTTP");

  // 이 미들웨어 자체는 라우터 보다 먼저 실행됨.
  use(request: Request, response: Response, next: NextFunction): void {
    // 1. 가장 먼저 실행
    const { ip, method, originalUrl } = request;
    const userAgent = request.get("user-agent") || "";

    // 3. 라우터 끝난 다음 실행
    response.on("finish", () => {
      const { statusCode } = response;
      const contentLength = response.get("content-length");
      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`
      );
    });

    // 2. 라우터로 감
    next();
  }
}

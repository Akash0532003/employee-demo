
import { Injectable, NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    const startTime = Date.now();

    console.log(`${req.method} ${req.url}`);

    res.once('finish', () => {
      console.log({
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        duration: `${Date.now() - startTime} ms`,
      });
    });

    next();
  }
}


import {
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { createPublicKey } from 'node:crypto';
import { HybridCryptoService } from './hybrid-crypto.service';

@Injectable()
export class HybridRequestMiddleware implements NestMiddleware {
  constructor(
    private readonly crypto: HybridCryptoService,
  ) {}

  use(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const clientKey = req.get('x-client-public-key');

      if (!clientKey || clientKey.length > 4096) {
        return res.status(400).json({
          message: 'Missing client public key',
        });
      }

      createPublicKey({
        key: Buffer.from(clientKey, 'base64'),
        format: 'der',
        type: 'spki',
      });

      if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        if (!req.body || req.body.__enc !== 'v1') {
          return res.status(400).json({
            message: 'Encrypted request required',
          });
        }

        req.body = this.crypto.decryptRequest(req.body);
      }

      next();
    } catch {
      return res.status(400).json({
        message: 'Invalid encrypted request',
      });
    }
  }
}

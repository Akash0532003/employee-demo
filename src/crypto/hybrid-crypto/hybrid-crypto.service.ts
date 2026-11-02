
import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';

import {
  constants,
  createCipheriv,
  createDecipheriv,
  createPublicKey,
  privateDecrypt,
  publicEncrypt,
  randomBytes,
} from 'node:crypto';

import { readFileSync } from 'node:fs';

export interface EncryptedEnvelope {
  __enc: 'v1';
  encryptedKey: string;
  iv: string;
  ciphertext: string;
}

@Injectable()
export class HybridCryptoService {
  private readonly privateKey = readFileSync(
    process.env.RSA_PRIVATE_KEY_PATH ??
      'certs/rsa-private.pem',
    'utf8',
  );

  decryptRequest(envelope: EncryptedEnvelope): unknown {
    try {
      this.validateEnvelope(envelope);

      const aesKey = privateDecrypt(
        {
          key: this.privateKey,
          padding: constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: 'sha256',
        },
        Buffer.from(envelope.encryptedKey, 'base64'),
      );

      if (aesKey.length !== 32) {
        throw new Error('Invalid AES key');
      }

      const iv = Buffer.from(envelope.iv, 'base64');
      const combined = Buffer.from(
        envelope.ciphertext,
        'base64',
      );

      if (iv.length !== 12 || combined.length < 16) {
        throw new Error('Invalid encrypted data');
      }

      // Web Crypto AES-GCM output contains ciphertext + 16-byte tag.
      const decipher = createDecipheriv(
        'aes-256-gcm',
        aesKey,
        iv,
      );

      decipher.setAuthTag(combined.subarray(-16));

      const plaintext = Buffer.concat([
        decipher.update(combined.subarray(0, -16)),
        decipher.final(),
      ]);

      return JSON.parse(plaintext.toString('utf8'));
    } catch {
      throw new BadRequestException(
        'Invalid encrypted request',
      );
    }
  }

  encryptResponse(
    data: unknown,
    clientPublicKeyBase64: string,
  ): EncryptedEnvelope {
    const aesKey = randomBytes(32);
    const iv = randomBytes(12);

    const cipher = createCipheriv(
      'aes-256-gcm',
      aesKey,
      iv,
    );

    const ciphertext = Buffer.concat([
      cipher.update(JSON.stringify(data), 'utf8'),
      cipher.final(),
      cipher.getAuthTag(),
    ]);

    const clientPublicKey = createPublicKey({
      key: Buffer.from(clientPublicKeyBase64, 'base64'),
      format: 'der',
      type: 'spki',
    });

    const encryptedKey = publicEncrypt(
      {
        key: clientPublicKey,
        padding: constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      aesKey,
    );

    return {
      __enc: 'v1',
      encryptedKey: encryptedKey.toString('base64'),
      iv: iv.toString('base64'),
      ciphertext: ciphertext.toString('base64'),
    };
  }

  private validateEnvelope(
    value: EncryptedEnvelope,
  ): void {
    if (
      !value ||
      value.__enc !== 'v1' ||
      typeof value.encryptedKey !== 'string' ||
      typeof value.iv !== 'string' ||
      typeof value.ciphertext !== 'string' ||
      value.encryptedKey.length > 2048 ||
      value.iv.length > 64 ||
      value.ciphertext.length > 2_000_000
    ) {
      throw new Error('Invalid envelope');
    }
  }
}

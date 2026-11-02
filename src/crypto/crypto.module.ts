import { Module } from '@nestjs/common';
import { HybridCryptoService } from './hybrid-crypto/hybrid-crypto.service';

@Module({
  providers: [HybridCryptoService],
  exports: [HybridCryptoService],
})
export class CryptoModule {}

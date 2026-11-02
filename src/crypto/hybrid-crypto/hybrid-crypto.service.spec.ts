import { Test, TestingModule } from '@nestjs/testing';
import { HybridCryptoService } from './hybrid-crypto.service';

describe('HybridCryptoService', () => {
  let service: HybridCryptoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HybridCryptoService],
    }).compile();

    service = module.get<HybridCryptoService>(HybridCryptoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

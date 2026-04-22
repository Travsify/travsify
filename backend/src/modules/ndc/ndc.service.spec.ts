import { Test, TestingModule } from '@nestjs/testing';
import { NdcService } from './ndc.service';

describe('NdcService', () => {
  let service: NdcService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NdcService],
    }).compile();

    service = module.get<NdcService>(NdcService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

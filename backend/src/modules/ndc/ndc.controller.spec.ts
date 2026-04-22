import { Test, TestingModule } from '@nestjs/testing';
import { NdcController } from './ndc.controller';

describe('NdcController', () => {
  let controller: NdcController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NdcController],
    }).compile();

    controller = module.get<NdcController>(NdcController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

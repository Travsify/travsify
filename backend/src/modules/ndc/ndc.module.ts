import { Module } from '@nestjs/common';
import { NdcService } from './ndc.service';
import { NdcController } from './ndc.controller';
import { DuffelService } from './duffel.service';

@Module({
  providers: [NdcService, DuffelService],
  controllers: [NdcController],
  exports: [NdcService, DuffelService],
})
export class NdcModule {}

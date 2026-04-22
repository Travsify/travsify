import { Module } from '@nestjs/common';
import { NdcService } from './ndc.service';
import { NdcController } from './ndc.controller';

@Module({
  providers: [NdcService],
  controllers: [NdcController],
  exports: [NdcService],
})
export class NdcModule {}

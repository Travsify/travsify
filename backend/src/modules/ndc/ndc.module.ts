import { Module } from '@nestjs/common';
import { NdcService } from './ndc.service';
import { NdcController } from './ndc.controller';
import { DuffelService } from './duffel.service';
import { CurrencyService } from '../../common/services/currency.service';

@Module({
  providers: [NdcService, DuffelService, CurrencyService],
  controllers: [NdcController],
  exports: [NdcService, DuffelService, CurrencyService],
})
export class NdcModule {}

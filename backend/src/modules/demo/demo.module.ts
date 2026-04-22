import { Module } from '@nestjs/common';
import { DemoController } from './demo.controller';
import { NdcModule } from '../ndc/ndc.module';

@Module({
  imports: [NdcModule],
  controllers: [DemoController],
})
export class DemoModule {}

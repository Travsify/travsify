import { Module } from '@nestjs/common';
import { DemoController } from './demo.controller';
import { NdcModule } from '../ndc/ndc.module';
import { LiteApiService } from './services/liteapi.service';
import { ShepperService } from './services/shepper.service';
import { GetYourGuideService } from './services/getyourguide.service';
import { MozioService } from './services/mozio.service';
import { SafetyWingService } from './services/safetywing.service';
import { FincraService } from './services/fincra.service';
import { StripeService } from './services/stripe.service';

@Module({
  imports: [NdcModule],
  controllers: [DemoController],
  providers: [
    LiteApiService,
    ShepperService,
    GetYourGuideService,
    MozioService,
    SafetyWingService,
    FincraService,
    StripeService,
  ],
  exports: [
    LiteApiService,
    ShepperService,
    GetYourGuideService,
    MozioService,
    SafetyWingService,
    FincraService,
    StripeService,
  ],
})
export class DemoModule {}

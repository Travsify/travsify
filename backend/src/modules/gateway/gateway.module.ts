import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { CheckoutService } from './checkout.service';
import { WebhooksController } from './webhooks.controller';
import { TenantModule } from '../tenant/tenant.module';
import { NdcModule } from '../ndc/ndc.module';
import { DemoModule } from '../demo/demo.module';

@Module({
  imports: [TenantModule, NdcModule, DemoModule],
  controllers: [GatewayController, WebhooksController],
  providers: [CheckoutService],
})
export class GatewayModule {}

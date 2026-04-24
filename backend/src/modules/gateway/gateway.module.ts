import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { CheckoutService } from './checkout.service';
import { WebhooksController } from './webhooks.controller';
import { TenantModule } from '../tenant/tenant.module';
import { NdcModule } from '../ndc/ndc.module';
import { DemoModule } from '../demo/demo.module';
import { ApiKeysModule } from '../api-keys/api-keys.module';

import { UsersModule } from '../users/users.module';
import { WalletModule } from '../wallet/wallet.module';
import { NotificationModule } from '../notifications/notification.module';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
  imports: [TenantModule, NdcModule, DemoModule, ApiKeysModule, UsersModule, WalletModule, NotificationModule, BookingsModule],
  controllers: [GatewayController, WebhooksController],
  providers: [CheckoutService],
})
export class GatewayModule {}

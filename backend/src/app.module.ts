import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NdcModule } from './modules/ndc/ndc.module';
import { DemoModule } from './modules/demo/demo.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { GatewayModule } from './modules/gateway/gateway.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ApiKeysModule } from './modules/api-keys/api-keys.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { KycModule } from './modules/kyc/kyc.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { NotificationModule } from './modules/notifications/notification.module';
import { AdminController } from './modules/admin/admin.controller';
import { ApiLogsModule } from './modules/api-logs/api-logs.module';
import { DeveloperWebhooksModule } from './modules/developer-webhooks/developer-webhooks.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/ndc_platform',
      autoLoadEntities: true,
      synchronize: true, // Disable in production
    }),
    NdcModule,
    DemoModule,
    TenantModule,
    GatewayModule,
    UsersModule,
    AuthModule,
    ApiKeysModule,
    BookingsModule,
    KycModule,
    WalletModule,
    NotificationModule,
    ApiLogsModule,
    DeveloperWebhooksModule,
  ],
  controllers: [AppController, AdminController],
  providers: [AppService],
})
export class AppModule {}

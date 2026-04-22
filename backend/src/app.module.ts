import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NdcModule } from './modules/ndc/ndc.module';
import { DemoModule } from './modules/demo/demo.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { GatewayModule } from './modules/gateway/gateway.module';
import { AdminController } from './modules/admin/admin.controller';

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
  ],
  controllers: [AppController, AdminController],
  providers: [AppService],
})
export class AppModule {}

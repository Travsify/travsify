import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { Wallet } from './entities/wallet.entity';
import { Transaction } from './entities/transaction.entity';
import { DemoModule } from '../demo/demo.module';
import { NotificationModule } from '../notifications/notification.module';
import { NdcModule } from '../ndc/ndc.module';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, Transaction]), DemoModule, NotificationModule, NdcModule],
  providers: [WalletService],
  controllers: [WalletController],
  exports: [WalletService],
})
export class WalletModule {}

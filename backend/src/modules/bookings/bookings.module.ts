import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from './entities/booking.entity';
import { User } from '../users/entities/user.entity';
import { WalletModule } from '../wallet/wallet.module';
import { NdcModule } from '../ndc/ndc.module';
import { ApiKeysModule } from '../api-keys/api-keys.module';
import { NotificationModule } from '../notifications/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, User]),
    WalletModule,
    NdcModule,
    ApiKeysModule,
    NotificationModule,
  ],
  providers: [BookingsService],
  controllers: [BookingsController],
  exports: [BookingsService],
})
export class BookingsModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeveloperWebhook } from './entities/developer-webhook.entity';
import { DeveloperWebhooksService } from './developer-webhooks.service';
import { DeveloperWebhooksController } from './developer-webhooks.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DeveloperWebhook])],
  providers: [DeveloperWebhooksService],
  controllers: [DeveloperWebhooksController],
  exports: [DeveloperWebhooksService],
})
export class DeveloperWebhooksModule {}

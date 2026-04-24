import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeveloperWebhook } from './entities/developer-webhook.entity';
import * as crypto from 'crypto';
import axios from 'axios';

@Injectable()
export class DeveloperWebhooksService {
  private readonly logger = new Logger(DeveloperWebhooksService.name);

  constructor(
    @InjectRepository(DeveloperWebhook)
    private webhookRepository: Repository<DeveloperWebhook>,
  ) {}

  async createWebhook(userId: string, data: { url: string; events: string[]; description?: string }): Promise<DeveloperWebhook> {
    const secret = 'whsec_' + crypto.randomBytes(24).toString('hex');
    const webhook = this.webhookRepository.create({
      userId,
      ...data,
      secret,
    });
    return this.webhookRepository.save(webhook);
  }

  async findByUserId(userId: string): Promise<DeveloperWebhook[]> {
    return this.webhookRepository.find({ where: { userId } });
  }

  async deleteWebhook(id: string): Promise<void> {
    await this.webhookRepository.delete(id);
  }

  async dispatchEvent(userId: string, event: string, payload: any) {
    const webhooks = await this.webhookRepository.find({ 
      where: { userId, isActive: true } 
    });

    for (const webhook of webhooks) {
      if (webhook.events.includes(event) || webhook.events.includes('*')) {
        this.sendWebhook(webhook, event, payload);
      }
    }
  }

  private async sendWebhook(webhook: DeveloperWebhook, event: string, payload: any) {
    const timestamp = Date.now();
    const signature = crypto
      .createHmac('sha256', webhook.secret)
      .update(`${timestamp}.${JSON.stringify(payload)}`)
      .digest('hex');

    try {
      await axios.post(webhook.url, payload, {
        headers: {
          'x-travsify-event': event,
          'x-travsify-signature': signature,
          'x-travsify-timestamp': timestamp.toString(),
        },
        timeout: 5000,
      });
      this.logger.log(`Webhook Sent: ${event} to ${webhook.url}`);
    } catch (err) {
      this.logger.error(`Webhook Failed: ${event} to ${webhook.url} - ${err.message}`);
    }
  }
}

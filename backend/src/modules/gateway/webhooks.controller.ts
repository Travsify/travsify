import { Controller, Post, Body, Headers, Logger } from '@nestjs/common';
import { CheckoutService } from './checkout.service';

@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(private readonly checkoutService: CheckoutService) {}

  /**
   * Handles successful collections from Fincra
   */
  @Post('fincra')
  async handleFincraWebhook(@Body() payload: any) {
    this.logger.log(`Webhook: Received Fincra event: ${payload.event}`);

    if (payload.event === 'collection.successful') {
      const reference = payload.data.reference;
      const metadata = payload.data.metadata || {};
      const vertical = metadata.vertical || 'flight';
      
      this.logger.log(`Webhook: Payment successful for ${vertical} (Ref: ${reference})`);
      
      return this.checkoutService.finalizeBooking(reference, vertical, {});
    }

    return { status: 'acknowledged' };
  }

  /**
   * Handles successful checkout sessions from Stripe
   */
  @Post('stripe')
  async handleStripeWebhook(@Body() payload: any) {
    this.logger.log(`Webhook: Received Stripe event: ${payload.type}`);

    if (payload.type === 'checkout.session.completed') {
      const session = payload.data.object;
      const reference = session.id;
      const metadata = session.metadata || {};
      const vertical = metadata.vertical || 'flight';
      
      this.logger.log(`Webhook: Stripe payment succeeded for ${vertical} (Session: ${reference})`);
      
      return this.checkoutService.finalizeBooking(reference, vertical, {});
    }

    return { status: 'acknowledged' };
  }
}

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
      this.logger.log(`Webhook: Payment successful for reference ${reference}`);
      
      // In a real scenario, we would fetch the booking metadata from DB
      // For this powerhouse demo, we proceed to finalize
      return this.checkoutService.finalizeBooking(reference, 'flight', {});
    }

    return { status: 'acknowledged' };
  }

  /**
   * Handles successful payment intents from Stripe
   */
  @Post('stripe')
  async handleStripeWebhook(@Body() payload: any) {
    this.logger.log(`Webhook: Received Stripe event: ${payload.type}`);

    if (payload.type === 'payment_intent.succeeded') {
      const intentId = payload.data.object.id;
      this.logger.log(`Webhook: Stripe payment succeeded for intent ${intentId}`);
      
      return this.checkoutService.finalizeBooking(intentId, 'hotel', {});
    }

    return { status: 'acknowledged' };
  }
}

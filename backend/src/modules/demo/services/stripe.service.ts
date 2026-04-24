import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private readonly stripe: Stripe;
  private readonly frontendUrl: string;
  private readonly webhookSecret: string;

  constructor(private configService: ConfigService) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY') || '';
    this.stripe = new Stripe(secretKey, {
      apiVersion: '2025-01-27.acacia' as any, // Use latest stable
    });
    this.frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    this.webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET') || '';
  }

  async createCheckoutSession(data: { amount: number, currency: string, description: string, email?: string, metadata?: any }) {
    this.logger.log(`Stripe: Creating checkout session for ${data.amount} ${data.currency}`);
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: data.currency.toLowerCase(),
            product_data: {
              name: 'Travsify Pay - Wallet Funding',
              description: data.description,
            },
            unit_amount: Math.round(data.amount * 100),
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${this.frontendUrl}/dashboard/wallets?status=success`,
        cancel_url: `${this.frontendUrl}/dashboard/wallets?status=cancelled`,
        customer_email: data.email,
        metadata: data.metadata,
      });

      return { status: 'success', link: session.url, id: session.id };
    } catch (error: any) {
      this.logger.error(`Stripe error: ${error.message}`);
      return { status: 'error', message: 'Stripe payment initiation failed' };
    }
  }

  async createSetupSession(email: string) {
    this.logger.log(`Stripe: Creating setup session for ${email}`);
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'setup',
        customer_email: email,
        success_url: `${this.frontendUrl}/dashboard/wallets?setup=success`,
        cancel_url: `${this.frontendUrl}/dashboard/wallets?setup=cancelled`,
      });
      return { status: 'success', link: session.url, id: session.id };
    } catch (error: any) {
      this.logger.error(`Stripe Setup error: ${error.message}`);
      return { status: 'error', message: 'Stripe setup initiation failed' };
    }
  }

  constructEvent(payload: string | Buffer, signature: string) {
    if (!this.webhookSecret) {
      this.logger.warn('Stripe Webhook Secret not configured. Skipping signature verification.');
      return JSON.parse(payload.toString());
    }
    return this.stripe.webhooks.constructEvent(payload, signature, this.webhookSecret);
  }
}

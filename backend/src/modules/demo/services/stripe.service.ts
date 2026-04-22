import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private readonly secretKey: string;
  private readonly baseUrl = 'https://api.stripe.com/v1';

  constructor(private configService: ConfigService) {
    this.secretKey = this.configService.get<string>('STRIPE_SECRET_KEY') || '';
  }

  async createPaymentIntent(data: { amount: number, currency: string, description: string }) {
    this.logger.log(`Stripe: Creating payment intent for ${data.amount} ${data.currency}`);
    try {
      // We use URLSearchParams because Stripe API uses x-www-form-urlencoded
      const params = new URLSearchParams();
      params.append('amount', Math.round(data.amount * 100).toString()); // Stripe uses cents
      params.append('currency', data.currency.toLowerCase());
      params.append('description', data.description);

      const response = await axios.post(`${this.baseUrl}/payment_intents`, params, {
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });
      return response.data;
    } catch (error) {
      this.logger.error(`Stripe error: ${error.message}`);
      return { status: 'error', message: 'Stripe payment initiation failed' };
    }
  }

  async verifyPayment(intentId: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/payment_intents/${intentId}`, {
        headers: { 'Authorization': `Bearer ${this.secretKey}` }
      });
      return response.data;
    } catch (error) {
      return { status: 'failed' };
    }
  }
}

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

  async createCheckoutSession(data: { amount: number, currency: string, description: string, email?: string, metadata?: any }) {
    this.logger.log(`Stripe: Creating checkout session for ${data.amount} ${data.currency}`);
    try {
      const params = new URLSearchParams();
      params.append('payment_method_types[]', 'card');
      params.append('line_items[0][price_data][currency]', data.currency.toLowerCase());
      params.append('line_items[0][price_data][product_data][name]', 'Travsify Pay - Flight Booking');
      params.append('line_items[0][price_data][product_data][description]', data.description);
      params.append('line_items[0][price_data][unit_amount]', Math.round(data.amount * 100).toString());
      params.append('line_items[0][quantity]', '1');
      params.append('mode', 'payment');
      params.append('success_url', 'https://travsify.com/dashboard/bookings?status=success');
      params.append('cancel_url', 'https://travsify.com/dashboard/flights?status=cancelled');
      if (data.email) {
        params.append('customer_email', data.email);
      }
      
      if (data.metadata) {
        Object.keys(data.metadata).forEach(key => {
          params.append(`metadata[${key}]`, data.metadata[key]);
        });
      }

      const response = await axios.post(`${this.baseUrl}/checkout/sessions`, params, {
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });
      return { status: 'success', link: response.data.url, id: response.data.id };
    } catch (error) {
      this.logger.error(`Stripe error: ${error.response?.data?.error?.message || error.message}`);
      return { status: 'error', message: 'Stripe payment initiation failed' };
    }
  }

  async verifyPayment(sessionId: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/checkout/sessions/${sessionId}`, {
        headers: { 'Authorization': `Bearer ${this.secretKey}` }
      });
      return response.data;
    } catch (error) {
      return { status: 'failed' };
    }
  }

  async createSetupSession(email: string) {
    this.logger.log(`Stripe: Creating setup session for ${email}`);
    try {
      const params = new URLSearchParams();
      params.append('payment_method_types[]', 'card');
      params.append('mode', 'setup');
      params.append('customer_email', email);
      params.append('success_url', 'https://travsify.com/dashboard/wallets?setup=success');
      params.append('cancel_url', 'https://travsify.com/dashboard/wallets?setup=cancelled');

      const response = await axios.post(`${this.baseUrl}/checkout/sessions`, params, {
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });
      return { status: 'success', link: response.data.url, id: response.data.id };
    } catch (error) {
      this.logger.error(`Stripe Setup error: ${error.response?.data?.error?.message || error.message}`);
      return { status: 'error', message: 'Stripe setup initiation failed' };
    }
  }
}

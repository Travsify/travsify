import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class FincraService {
  private readonly logger = new Logger(FincraService.name);
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.fincra.com';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('FINCRA_API_KEY') || '';
  }

  async createPaymentLink(data: { amount: number, currency: string, email: string, reference: string, metadata?: any }) {
    this.logger.log(`Fincra: Initiating payment of ${data.amount} ${data.currency} for ${data.email}`);
    try {
      const response = await axios.post(`${this.baseUrl}/checkout/payments`, {
        amount: data.amount,
        currency: data.currency,
        customer: { email: data.email },
        reference: data.reference,
        payment_methods: ['card', 'bank_transfer', 'mobile_money'],
        metadata: data.metadata,
      }, {
        headers: { 'api-key': this.apiKey }
      });
      return response.data;
    } catch (error) {
      this.logger.error(`Fincra error: ${error.message}`);
      return { status: 'error', message: 'Fincra payment initiation failed' };
    }
  }

  async verifyTransaction(reference: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/core/transactions/verify/${reference}`, {
        headers: { 'api-key': this.apiKey }
      });
      return response.data;
    } catch (error) {
      return { status: 'failed' };
    }
  }
}

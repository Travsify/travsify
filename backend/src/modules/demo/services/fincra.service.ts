import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class FincraService {
  private readonly logger = new Logger(FincraService.name);
  private readonly apiKey: string;
  private readonly businessId: string;
  private readonly baseUrl = 'https://api.fincra.com';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('FINCRA_API_KEY') || '';
    this.businessId = this.configService.get<string>('FINCRA_BUSINESS_ID') || '';
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

  /**
   * Initiate a bank payout (withdrawal) via Fincra Disbursement API.
   * This sends NGN from the Travsify business wallet to the user's bank.
   */
  async initiatePayout(data: {
    amount: number;
    currency: string;
    bankCode: string;
    accountNumber: string;
    accountName: string;
    reference: string;
    narration?: string;
  }) {
    this.logger.log(`Fincra: Initiating payout of ${data.amount} ${data.currency} to ${data.accountNumber}`);
    try {
      const response = await axios.post(`${this.baseUrl}/disbursements/payouts`, {
        sourceCurrency: data.currency,
        destinationCurrency: data.currency,
        amount: data.amount,
        business: this.businessId,
        description: data.narration || 'Travsify Wallet Withdrawal',
        paymentDestination: 'bank_account',
        customerReference: data.reference,
        beneficiary: {
          firstName: data.accountName.split(' ')[0] || 'User',
          lastName: data.accountName.split(' ').slice(1).join(' ') || 'User',
          accountHolderName: data.accountName,
          accountNumber: data.accountNumber,
          type: 'individual',
          bankCode: data.bankCode,
        },
      }, {
        headers: {
          'api-key': this.apiKey,
          'Content-Type': 'application/json',
        }
      });
      return { status: 'success', data: response.data };
    } catch (error) {
      this.logger.error(`Fincra payout error: ${error.response?.data?.message || error.message}`);
      return { status: 'error', message: error.response?.data?.message || 'Payout initiation failed' };
    }
  }

  /**
   * Resolve an NGN bank account to verify the account holder name.
   */
  async resolveBankAccount(bankCode: string, accountNumber: string) {
    this.logger.log(`Fincra: Resolving account ${accountNumber} at bank ${bankCode}`);
    try {
      const response = await axios.post(`${this.baseUrl}/core/accounts/resolve`, {
        bankCode,
        accountNumber,
        type: 'bank_account',
      }, {
        headers: { 'api-key': this.apiKey }
      });
      return { status: 'success', data: response.data?.data || response.data };
    } catch (error) {
      this.logger.error(`Fincra resolve error: ${error.response?.data?.message || error.message}`);
      return { status: 'error', message: 'Could not resolve bank account' };
    }
  }
}

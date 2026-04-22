import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AtlysService {
  private readonly logger = new Logger(AtlysService.name);
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.atlys.com/v1';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('ATLYS_API_KEY') || '';
  }

  async getVisaRequirements(params: {
    nationality: string;
    destination: string;
  }) {
    this.logger.log(`Visa check: ${params.nationality} → ${params.destination}`);
    try {
      const response = await axios.get(`${this.baseUrl}/requirements`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/json',
        },
        params: {
          nationality: params.nationality,
          destination: params.destination,
        },
        timeout: 15000,
      });
      return response.data;
    } catch (error) {
      this.logger.error(`Atlys error: ${error.message}`);
      return this.getFallbackData(params.nationality, params.destination);
    }
  }

  async getVisaApplicationStatus(applicationId: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/applications/${applicationId}`, {
        headers: { 'Authorization': `Bearer ${this.apiKey}`, 'Accept': 'application/json' },
        timeout: 10000,
      });
      return response.data;
    } catch (error) {
      this.logger.error(`Visa status error: ${error.message}`);
      return { error: 'Unable to fetch application status', applicationId };
    }
  }

  private getFallbackData(nationality: string, destination: string) {
    return {
      source: 'demo',
      nationality: nationality || 'NG',
      destination: destination || 'GB',
      requirements: [
        {
          visaType: 'Tourist Visa',
          required: true,
          processingTime: '5-10 business days',
          fee: { amount: 100, currency: 'USD' },
          validity: '6 months',
          entries: 'Multiple',
          documentsRequired: [
            'Valid Passport (6+ months validity)',
            'Passport-size photographs (2)',
            'Bank statement (last 3 months)',
            'Travel itinerary / Flight booking',
            'Hotel reservation',
            'Travel insurance certificate',
          ],
        },
        {
          visaType: 'eVisa (Electronic)',
          required: true,
          processingTime: '24-72 hours',
          fee: { amount: 65, currency: 'USD' },
          validity: '90 days',
          entries: 'Single',
          documentsRequired: [
            'Digital passport scan',
            'Digital photograph',
            'Email address',
            'Credit/Debit card for payment',
          ],
        },
      ],
    };
  }
}

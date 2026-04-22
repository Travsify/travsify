import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class SafetyWingService {
  private readonly logger = new Logger(SafetyWingService.name);
  private readonly partnerId: string;
  private readonly baseUrl = 'https://api.safetywing.com/v1';

  constructor(private configService: ConfigService) {
    this.partnerId = this.configService.get<string>('SAFETYWING_PARTNER_ID') || '';
  }

  async getQuotes(params: {
    destination: string;
    startDate: string;
    endDate: string;
    age: number;
    citizenship?: string;
  }) {
    this.logger.log(`Insurance quote: ${params.destination} | ${params.startDate} - ${params.endDate}`);
    try {
      const response = await axios.get(`${this.baseUrl}/quotes`, {
        headers: { 'Accept': 'application/json' },
        params: {
          partner_id: this.partnerId,
          destination: params.destination,
          start_date: params.startDate,
          end_date: params.endDate,
          age: params.age,
          citizenship: params.citizenship || 'NG',
        },
        timeout: 15000,
      });
      return response.data;
    } catch (error) {
      this.logger.error(`SafetyWing error: ${error.message}`);
      return this.getFallbackData(params.destination, params.startDate, params.endDate);
    }
  }

  private getFallbackData(destination: string, startDate: string, endDate: string) {
    const days = Math.max(1, Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)));
    return {
      source: 'demo',
      destination: destination || 'Worldwide',
      coveragePeriod: `${days} days`,
      quotes: [
        {
          id: 'sw-1',
          plan: 'Nomad Insurance',
          provider: 'SafetyWing',
          price: { amount: Math.round(days * 1.5), currency: 'USD', period: `${days} days` },
          coverage: {
            medical: '$250,000',
            evacuation: '$100,000',
            tripInterruption: '$5,000',
            lostLuggage: '$3,000',
          },
          features: ['COVID-19 coverage', 'Adventure sports', 'No deductible on evacuation'],
          rating: 4.6,
        },
        {
          id: 'sw-2',
          plan: 'Remote Health',
          provider: 'SafetyWing',
          price: { amount: Math.round(days * 3.2), currency: 'USD', period: `${days} days` },
          coverage: {
            medical: '$1,000,000',
            evacuation: '$250,000',
            dental: '$5,000',
            vision: '$2,500',
            maternity: '$100,000',
          },
          features: ['Comprehensive health', 'Worldwide coverage', 'Mental health included', 'Prescription drugs'],
          rating: 4.8,
        },
        {
          id: 'sw-3',
          plan: 'Travsify Basic Shield',
          provider: 'Travsify Insurance',
          price: { amount: Math.round(days * 0.9), currency: 'USD', period: `${days} days` },
          coverage: {
            medical: '$50,000',
            evacuation: '$25,000',
            tripCancellation: '$2,000',
          },
          features: ['Budget-friendly', 'Instant activation', '24/7 support'],
          rating: 4.3,
        },
      ],
    };
  }
}

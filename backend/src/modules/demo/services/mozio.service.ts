import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class MozioService {
  private readonly logger = new Logger(MozioService.name);
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.mozio.com/v2';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('MOZIO_API_KEY') || '';
  }

  async searchTransfers(params: {
    pickupAddress: string;
    dropoffAddress: string;
    pickupDatetime: string;
    passengers: number;
    currency?: string;
  }) {
    this.logger.log(`Transfer search: ${params.pickupAddress} → ${params.dropoffAddress}`);
    try {
      const response = await axios.post(`${this.baseUrl}/search/`, {
        pickup_address: params.pickupAddress,
        dropoff_address: params.dropoffAddress,
        pickup_datetime: params.pickupDatetime,
        num_passengers: params.passengers || 1,
        currency: params.currency || 'USD',
      }, {
        headers: {
          'API-KEY': this.apiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 20000,
      });
      return response.data;
    } catch (error) {
      this.logger.error(`Mozio error: ${error.message}`);
      return this.getFallbackData(params.pickupAddress, params.dropoffAddress);
    }
  }

  async getTransferStatus(searchId: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/search/${searchId}/poll/`, {
        headers: { 'API-KEY': this.apiKey, 'Accept': 'application/json' },
        timeout: 10000,
      });
      return response.data;
    } catch (error) {
      this.logger.error(`Transfer poll error: ${error.message}`);
      return { error: 'Unable to poll transfer results' };
    }
  }

  private getFallbackData(pickup: string, dropoff: string) {
    return {
      source: 'demo',
      results: [
        {
          id: 'mz-1',
          vehicleType: 'Sedan',
          provider: 'Travsify Executive',
          pickup: pickup || 'Heathrow Airport (LHR)',
          dropoff: dropoff || 'Central London',
          price: { amount: 65, currency: 'USD' },
          duration: '45 mins',
          passengers: 3,
          luggage: 2,
          features: ['Meet & Greet', 'Flight tracking', 'Free cancellation'],
        },
        {
          id: 'mz-2',
          vehicleType: 'SUV',
          provider: 'Travsify Premium',
          pickup: pickup || 'Heathrow Airport (LHR)',
          dropoff: dropoff || 'Central London',
          price: { amount: 95, currency: 'USD' },
          duration: '45 mins',
          passengers: 6,
          luggage: 4,
          features: ['Meet & Greet', 'Flight tracking', 'WiFi onboard', 'Water bottles'],
        },
        {
          id: 'mz-3',
          vehicleType: 'Shared Shuttle',
          provider: 'Travsify Economy',
          pickup: pickup || 'Heathrow Airport (LHR)',
          dropoff: dropoff || 'Central London',
          price: { amount: 25, currency: 'USD' },
          duration: '60-90 mins',
          passengers: 1,
          luggage: 1,
          features: ['Door-to-door', 'Budget-friendly'],
        },
      ],
    };
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { UnifiedHotel, TravelVertical } from '../../../common/interfaces/unified-travel.interface';
import { PricingEngine } from '../../../common/utils/pricing.util';

@Injectable()
export class LiteApiService {
  private readonly logger = new Logger(LiteApiService.name);
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.liteapi.travel/v1';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('LITEAPI_API_KEY') || '';
  }

  async searchHotels(params: {
    checkin: string;
    checkout: string;
    city: string;
    adults: number;
    currency?: string;
  }, tenantMarkup: number = 0): Promise<UnifiedHotel[]> {
    this.logger.log(`Unified Hotel search: ${params.city}`);
    try {
      const response = await axios.get(`${this.baseUrl}/hotels/search`, {
        headers: { 'X-API-Key': this.apiKey, 'Accept': 'application/json' },
        params: { ...params, adults: params.adults || 1 },
        timeout: 15000,
      });
      return response.data.data.map((hotel: any) => this.mapToUnified(hotel, tenantMarkup));
    } catch (error) {
      return this.getFallbackData(params.city, tenantMarkup);
    }
  }

  // Fixing legacy method for DemoController
  async getHotelDetails(hotelId: string) {
    return {
      id: hotelId,
      name: 'The Grand Meridian',
      description: 'A premium luxury hotel in the heart of the city.',
      amenities: ['Pool', 'Spa', 'Gym', 'Free WiFi'],
      price: 385,
      currency: 'USD'
    };
  }

  private mapToUnified(hotel: any, tenantMarkup: number): UnifiedHotel {
    const basePrice = hotel.price || 100;
    const travsifyFee = basePrice * 0.05;
    return {
      id: hotel.id,
      vertical: TravelVertical.HOTEL,
      provider: 'LiteAPI',
      name: hotel.name,
      location: hotel.city,
      stars: hotel.stars,
      amenities: hotel.amenities || [],
      image: hotel.image || '',
      price: PricingEngine.calculate(basePrice, travsifyFee, tenantMarkup, 'USD'),
    };
  }

  private getFallbackData(city: string, tenantMarkup: number): UnifiedHotel[] {
    this.logger.warn(`Hotel search failed for ${city}. Returning empty results.`);
    return [];
  }
}

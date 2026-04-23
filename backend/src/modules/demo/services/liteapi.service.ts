import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { UnifiedHotel, TravelVertical } from '../../../common/interfaces/unified-travel.interface';
import { PricingEngine } from '../../../common/utils/pricing.util';
import { CurrencyService } from '../../../common/services/currency.service';

@Injectable()
export class LiteApiService {
  private readonly logger = new Logger(LiteApiService.name);
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.liteapi.travel/v1';

  constructor(
    private configService: ConfigService,
    private currencyService: CurrencyService
  ) {
    this.apiKey = this.configService.get<string>('LITEAPI_API_KEY') || '';
  }

  async searchHotels(params: {
    checkin: string;
    checkout: string;
    city: string;
    adults: number;
    currency?: string;
  }, tenantMarkup: number = 0): Promise<UnifiedHotel[]> {
    const targetCurrency = params.currency || 'USD';
    this.logger.log(`Unified Hotel search: ${params.city}`);
    try {
      const response = await axios.get(`${this.baseUrl}/hotels/search`, {
        headers: { 'X-API-Key': this.apiKey, 'Accept': 'application/json' },
        params: { ...params, adults: params.adults || 1 },
        timeout: 15000,
      });
      return response.data.data.map((hotel: any) => this.mapToUnified(hotel, tenantMarkup, targetCurrency));
    } catch (error) {
      return this.getFallbackData(params.city, tenantMarkup, targetCurrency);
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

  private mapToUnified(hotel: any, tenantMarkup: number, targetCurrency: string): UnifiedHotel {
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
      price: PricingEngine.calculate(basePrice, travsifyFee, tenantMarkup, 'USD', targetCurrency, this.currencyService),
    };
  }

  private getFallbackData(city: string, tenantMarkup: number, targetCurrency: string): UnifiedHotel[] {
    this.logger.warn(`Hotel search failed for ${city}. Returning fallback results.`);
    
    const fallbackHotels = [
      {
        id: `sim-hotel-1-${Date.now()}`,
        name: `The Grand Meridian ${city.charAt(0).toUpperCase() + city.slice(1)}`,
        stars: 5,
        basePrice: 385,
        amenities: ['Pool', 'Spa', 'Gym', 'Free WiFi', 'Room Service'],
        image: 'https://images.unsplash.com/photo-1566073171639-4d9ff100c971?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: `sim-hotel-2-${Date.now()}`,
        name: `${city.charAt(0).toUpperCase() + city.slice(1)} Luxury Suites`,
        stars: 4,
        basePrice: 220,
        amenities: ['Gym', 'Free WiFi', 'Restaurant', 'Bar'],
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: `sim-hotel-3-${Date.now()}`,
        name: `Oasis Boutique Hotel ${city.charAt(0).toUpperCase() + city.slice(1)}`,
        stars: 4,
        basePrice: 195,
        amenities: ['Free WiFi', 'Breakfast Included', 'Pool'],
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: `sim-hotel-4-${Date.now()}`,
        name: `Central Business Inn ${city.charAt(0).toUpperCase() + city.slice(1)}`,
        stars: 3,
        basePrice: 120,
        amenities: ['Free WiFi', 'Business Center', 'Parking'],
        image: 'https://images.unsplash.com/photo-1551882547-ff40c0d5b5df?auto=format&fit=crop&w=800&q=80'
      }
    ];

    return fallbackHotels.map(hotel => {
      const travsifyFee = hotel.basePrice * 0.05;
      return {
        id: hotel.id,
        vertical: TravelVertical.HOTEL,
        provider: 'LiteAPI (Simulated)',
        name: hotel.name,
        location: city.charAt(0).toUpperCase() + city.slice(1),
        stars: hotel.stars,
        amenities: hotel.amenities,
        image: hotel.image,
        price: PricingEngine.calculate(hotel.basePrice, travsifyFee, tenantMarkup, 'USD', targetCurrency, this.currencyService),
      };
    });
  }
}

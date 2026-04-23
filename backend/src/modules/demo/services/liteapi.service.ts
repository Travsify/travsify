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
  private readonly baseUrl = 'https://api.liteapi.travel/v3.0';

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
    const cityName = params.city.trim();
    const countryCode = this.getCountryCode(cityName);
    
    this.logger.log(`Live Hotel search (v3.0): ${cityName} (${countryCode})`);
    
    try {
      // Step 1: Get list of hotels in the city
      const hotelsResponse = await axios.get(`${this.baseUrl}/data/hotels`, {
        headers: { 'X-API-Key': this.apiKey, 'Accept': 'application/json' },
        params: { countryCode, cityName, limit: 10 },
        timeout: 10000,
      });

      const hotels = hotelsResponse.data.data;
      if (!hotels || hotels.length === 0) {
        this.logger.warn(`No hotels found for ${cityName} (${countryCode})`);
        return [];
      }

      const hotelIds = hotels.map((h: any) => h.id).join(',');

      // Step 2: Get live rates for these hotels
      // Note: checkin/checkout dates should be in YYYY-MM-DD
      const ratesResponse = await axios.get(`${this.baseUrl}/hotels/rates`, {
        headers: { 'X-API-Key': this.apiKey, 'Accept': 'application/json' },
        params: {
          hotelIds,
          checkin: params.checkin,
          checkout: params.checkout,
          adults: params.adults || 1,
          currency: 'USD', // Always fetch in USD for consistent pricing engine calculation
          guestNationality: 'US',
        },
        timeout: 15000,
      });

      const rates = ratesResponse.data.data || [];
      
      // Combine static data with rates
      return hotels.map((hotel: any) => {
        const hotelRate = rates.find((r: any) => r.hotelId === hotel.id);
        if (!hotelRate) return null;
        return this.mapToUnified(hotel, hotelRate, tenantMarkup, targetCurrency);
      }).filter(Boolean) as UnifiedHotel[];

    } catch (error: any) {
      this.logger.error(`Live Hotel search failed for ${cityName}: ${error.response?.data?.message || error.message}`);
      throw new Error(`Live Hotel API Search Failed: ${error.response?.data?.message || error.message}`);
    }
  }

  private getCountryCode(city: string): string {
    const lowerCity = city.toLowerCase();
    if (lowerCity.includes('lagos') || lowerCity.includes('abuja') || lowerCity.includes('portharcourt') || lowerCity.includes('kano')) return 'NG';
    if (lowerCity.includes('dubai') || lowerCity.includes('abu dhabi')) return 'AE';
    if (lowerCity.includes('london') || lowerCity.includes('manchester')) return 'GB';
    if (lowerCity.includes('new york') || lowerCity.includes('miami') || lowerCity.includes('houston')) return 'US';
    return 'NG'; // Default to Nigeria as primary target market
  }

  // Legacy method for DemoController
  async getHotelDetails(hotelId: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/data/hotels/${hotelId}`, {
        headers: { 'X-API-Key': this.apiKey },
      });
      return response.data.data;
    } catch (err) {
      return { id: hotelId, name: 'Hotel Details Unavailable' };
    }
  }

  private mapToUnified(hotel: any, rate: any, tenantMarkup: number, targetCurrency: string): UnifiedHotel {
    const basePrice = rate.retailRate?.total?.[0]?.amount || rate.total || 100;
    const travsifyFee = basePrice * 0.05;
    return {
      id: hotel.id,
      vertical: TravelVertical.HOTEL,
      provider: 'LiteAPI',
      name: hotel.name,
      location: hotel.city,
      stars: hotel.stars || 4,
      amenities: hotel.facilityIds ? ['WiFi', 'Pool', 'Parking', 'Gym'] : [], // Mapping complex facility IDs would need a lookup table
      image: hotel.main_photo || hotel.thumbnail || 'https://images.unsplash.com/photo-1566073171639-4d9ff100c971?auto=format&fit=crop&w=800&q=80',
      price: PricingEngine.calculate(basePrice, travsifyFee, tenantMarkup, 'USD', targetCurrency, this.currencyService),
    };
  }
}

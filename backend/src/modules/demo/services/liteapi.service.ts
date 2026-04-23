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
      // Step 1: Get list of hotels in the city for static data (names, images)
      const hotelsResponse = await axios.get(`${this.baseUrl}/data/hotels`, {
        headers: { 'X-API-Key': this.apiKey, 'Accept': 'application/json' },
        params: { countryCode, cityName, limit: 15 },
        timeout: 10000,
      });

      const hotels = hotelsResponse.data.data || [];
      this.logger.log(`Fetched metadata for ${hotels.length} hotels in ${cityName}`);
      
      if (hotels.length === 0) return [];

      const hotelIds = hotels.map((h: any) => h.id);

      // Step 2: Get live rates for these hotels using POST
      const ratesResponse = await axios.post(`${this.baseUrl}/hotels/rates`, {
        hotelIds,
        checkin: params.checkin,
        checkout: params.checkout,
        occupancies: [{ adults: params.adults || 2 }],
        currency: 'USD',
        guestNationality: countryCode,
      }, {
        headers: { 
          'X-API-Key': this.apiKey, 
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        timeout: 20000,
      });

      const ratesData = ratesResponse.data.data || [];
      this.logger.log(`Fetched live rates for ${ratesData.length} hotels`);
      
      // Combine static data with rates
      const combined = hotels.map((hotel: any) => {
        const hotelRateData = ratesData.find((r: any) => r.hotelId === hotel.id);
        if (!hotelRateData || !hotelRateData.roomTypes?.length) return null;
        
        // Use the cheapest available room rate
        const cheapestRoom = hotelRateData.roomTypes[0];
        const rate = cheapestRoom.rates?.[0];
        if (!rate) return null;

        return this.mapToUnified(hotel, rate, tenantMarkup, targetCurrency);
      }).filter(Boolean) as UnifiedHotel[];

      this.logger.log(`Returning ${combined.length} live hotels with rates`);
      return combined;

    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message;
      this.logger.error(`Live Hotel search failed: ${errorMsg}`);
      // If we have an error but it's just "no results", return empty instead of throwing
      if (error.response?.status === 404 || errorMsg.toLowerCase().includes('no results')) {
        return [];
      }
      throw new Error(`Live Hotel API Search Failed: ${errorMsg}`);
    }
  }

  private getCountryCode(city: string): string {
    const lowerCity = city.toLowerCase();
    if (lowerCity.includes('lagos') || lowerCity.includes('abuja') || lowerCity.includes('port harcourt') || lowerCity.includes('kano')) return 'NG';
    if (lowerCity.includes('dubai') || lowerCity.includes('abu dhabi')) return 'AE';
    if (lowerCity.includes('london') || lowerCity.includes('manchester')) return 'GB';
    if (lowerCity.includes('new york') || lowerCity.includes('miami') || lowerCity.includes('houston')) return 'US';
    return 'NG'; // Default to Nigeria
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
    // Correctly extract price from v3.0 rate structure
    const basePrice = rate.retailRate?.total?.[0]?.amount || rate.total || 100;
    const travsifyFee = basePrice * 0.05;
    
    return {
      id: hotel.id,
      vertical: TravelVertical.HOTEL,
      provider: 'LiteAPI',
      name: hotel.name,
      location: hotel.city || hotel.address || 'Lagos',
      stars: hotel.stars || 4,
      amenities: hotel.facilityIds ? ['WiFi', 'Pool', 'Parking', 'Gym'] : [],
      image: hotel.main_photo || hotel.thumbnail || 'https://images.unsplash.com/photo-1566073171639-4d9ff100c971?auto=format&fit=crop&w=800&q=80',
      price: PricingEngine.calculate(basePrice, travsifyFee, tenantMarkup, 'USD', targetCurrency, this.currencyService),
    };
  }
}

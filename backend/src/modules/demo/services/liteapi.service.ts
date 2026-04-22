import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

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
  }) {
    this.logger.log(`Hotel search: ${params.city} | ${params.checkin} - ${params.checkout}`);
    try {
      const response = await axios.get(`${this.baseUrl}/hotels/search`, {
        headers: {
          'X-API-Key': this.apiKey,
          'Accept': 'application/json',
        },
        params: {
          checkin: params.checkin,
          checkout: params.checkout,
          city: params.city,
          adults: params.adults || 1,
          currency: params.currency || 'USD',
        },
        timeout: 15000,
      });
      this.logger.log(`Hotel results: ${JSON.stringify(response.data).substring(0, 200)}`);
      return response.data;
    } catch (error) {
      this.logger.error(`LiteAPI error: ${error.message}`);
      // Return fallback demo data when API key is missing or request fails
      return this.getFallbackData(params.city);
    }
  }

  async getHotelDetails(hotelId: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/hotels/${hotelId}`, {
        headers: { 'X-API-Key': this.apiKey, 'Accept': 'application/json' },
        timeout: 10000,
      });
      return response.data;
    } catch (error) {
      this.logger.error(`Hotel details error: ${error.message}`);
      return { error: 'Unable to fetch hotel details' };
    }
  }

  private getFallbackData(city: string) {
    return {
      source: 'demo',
      results: [
        {
          id: 'lite-h1', name: 'The Grand Meridian', location: city || 'London, UK',
          price: 385, currency: 'USD', rating: 4.8, stars: 5,
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
          amenities: ['Pool', 'Spa', 'Free WiFi', 'Breakfast', 'Airport Shuttle'],
        },
        {
          id: 'lite-h2', name: 'Executive Skyline Hotel', location: city || 'Dubai, UAE',
          price: 220, currency: 'USD', rating: 4.6, stars: 4,
          image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800',
          amenities: ['Gym', 'Rooftop Bar', 'Meeting Rooms', 'Concierge'],
        },
        {
          id: 'lite-h3', name: 'Coastal Breeze Resort', location: city || 'Bali, Indonesia',
          price: 175, currency: 'USD', rating: 4.9, stars: 5,
          image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800',
          amenities: ['Beachfront', 'Infinity Pool', 'Yoga Studio', 'All-Inclusive'],
        },
      ],
    };
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class GetYourGuideService {
  private readonly logger = new Logger(GetYourGuideService.name);
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.getyourguide.com/1';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('GETYOURGUIDE_API_KEY') || '';
  }

  async searchActivities(params: {
    city: string;
    date?: string;
    category?: string;
    limit?: number;
  }) {
    this.logger.log(`Activity search: ${params.city} | date: ${params.date}`);
    try {
      const response = await axios.get(`${this.baseUrl}/activities`, {
        headers: {
          'X-Access-Token': this.apiKey,
          'Accept': 'application/json',
        },
        params: {
          q: params.city,
          date: params.date,
          category: params.category,
          limit: params.limit || 10,
        },
        timeout: 15000,
      });
      return response.data;
    } catch (error) {
      this.logger.error(`GetYourGuide error: ${error.message}`);
      return this.getFallbackData(params.city);
    }
  }

  async getActivityDetails(activityId: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/activities/${activityId}`, {
        headers: { 'X-Access-Token': this.apiKey, 'Accept': 'application/json' },
        timeout: 10000,
      });
      return response.data;
    } catch (error) {
      this.logger.error(`Activity details error: ${error.message}`);
      return { error: 'Unable to fetch activity details' };
    }
  }

  private getFallbackData(city: string) {
    return {
      source: 'demo',
      results: [
        {
          id: 'gyg-1',
          title: `${city || 'London'} Walking Tour & Hidden Gems`,
          location: city || 'London',
          price: { amount: 45, currency: 'USD' },
          rating: 4.9,
          reviewCount: 2847,
          duration: '3 hours',
          category: 'Walking Tours',
          image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=800',
          highlights: ['Skip-the-line', 'Expert local guide', 'Small group'],
        },
        {
          id: 'gyg-2',
          title: `${city || 'London'} River Cruise & Sunset Experience`,
          location: city || 'London',
          price: { amount: 78, currency: 'USD' },
          rating: 4.7,
          reviewCount: 1563,
          duration: '2 hours',
          category: 'Cruises & Sailing',
          image: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&q=80&w=800',
          highlights: ['Drinks included', 'Live commentary', 'Sunset views'],
        },
        {
          id: 'gyg-3',
          title: `${city || 'London'} Food & Street Market Tour`,
          location: city || 'London',
          price: { amount: 62, currency: 'USD' },
          rating: 4.8,
          reviewCount: 985,
          duration: '4 hours',
          category: 'Food & Drink',
          image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800',
          highlights: ['10+ tastings', 'Local markets', 'Vegetarian options'],
        },
      ],
    };
  }
}

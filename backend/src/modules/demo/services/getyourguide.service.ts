import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UnifiedExperience, TravelVertical } from '../../../common/interfaces/unified-travel.interface';
import { PricingEngine } from '../../../common/utils/pricing.util';

@Injectable()
export class GetYourGuideService {
  private readonly logger = new Logger(GetYourGuideService.name);
  private readonly partnerId: string;

  constructor(private configService: ConfigService) {
    this.partnerId = this.configService.get<string>('GYG_PARTNER_ID') || 'travsify';
  }

  async getTours(location: string, tenantMarkup: number = 0): Promise<UnifiedExperience[]> {
    this.logger.log(`GetYourGuide: Fetching tours for ${location}`);
    
    const basePrice = 120;
    const travsifyFee = 25;

    return [{
      id: `gyg-${Math.random().toString(36).substring(7)}`,
      vertical: TravelVertical.EXPERIENCE,
      provider: 'GetYourGuide',
      title: 'City Highlights Private Tour',
      location,
      duration: '4 Hours',
      price: PricingEngine.calculate(basePrice, travsifyFee, tenantMarkup, 'USD'),
      bookingUrl: `https://www.getyourguide.com/s/?q=${location}&partner_id=${this.partnerId}`,
    }];
  }

  // Legacy methods for DemoController
  async searchActivities(params: any) {
    return this.getTours(params.city || 'London');
  }

  async getActivityDetails(activityId: string) {
    return { id: activityId, title: 'City Highlights Private Tour', price: 120 };
  }
}

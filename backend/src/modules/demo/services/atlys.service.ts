import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UnifiedVisa, TravelVertical } from '../../../common/interfaces/unified-travel.interface';
import { PricingEngine } from '../../../common/utils/pricing.util';

@Injectable()
export class AtlysService {
  private readonly logger = new Logger(AtlysService.name);
  private readonly partnerId: string;

  constructor(private configService: ConfigService) {
    this.partnerId = this.configService.get<string>('ATLYS_PARTNER_ID') || 'travsify';
  }

  // Fixing parameter signature for DemoController
  async getVisaRequirements(params: { destination: string, nationality: string }, tenantMarkup: number = 0): Promise<UnifiedVisa[]> {
    const { destination, nationality } = params;
    this.logger.log(`Atlys: Fetching visa requirements for ${nationality} -> ${destination}`);
    
    const basePrice = 50; 
    const travsifyFee = 15;

    return [{
      id: `visa-${destination.toLowerCase()}`,
      vertical: TravelVertical.VISA,
      destination,
      nationality,
      requirements: ['Valid Passport', 'Passport Photo', 'Proof of Accommodation'],
      processingTime: '3-5 Business Days',
      price: PricingEngine.calculate(basePrice, travsifyFee, tenantMarkup, 'USD'),
      bookingUrl: `https://www.atlys.com/apply?destination=${destination}&nationality=${nationality}&ref=${this.partnerId}`,
    }];
  }

  async getVisaApplicationStatus(applicationId: string) {
    return { status: 'processing', applicationId };
  }
}

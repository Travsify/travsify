import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UnifiedVisa, TravelVertical } from '../../../common/interfaces/unified-travel.interface';
import { PricingEngine } from '../../../common/utils/pricing.util';

@Injectable()
export class ShepperService {
  private readonly logger = new Logger(ShepperService.name);
  private readonly partnerId: string;

  constructor(private configService: ConfigService) {
    this.partnerId = this.configService.get<string>('SHEPPER_PARTNER_ID') || 'travsify-visa';
  }

  async getVisaRequirements(params: { destination: string, nationality: string }, tenantMarkup: number = 0): Promise<UnifiedVisa[]> {
    const { destination, nationality } = params;
    this.logger.log(`Shepper: Fetching visa requirements for ${nationality} -> ${destination}`);
    
    const basePrice = 45; 
    const travsifyFee = 20;

    return [{
      id: `visa-${destination.toLowerCase()}`,
      vertical: TravelVertical.VISA,
      destination,
      nationality,
      requirements: ['Valid Passport', 'Biometric Photo', 'Letter of Invitation'],
      processingTime: '2-4 Business Days',
      price: PricingEngine.calculate(basePrice, travsifyFee, tenantMarkup, 'USD'),
      bookingUrl: `https://shepper.io/apply?to=${destination}&from=${nationality}&ref=${this.partnerId}`,
    }];
  }

  async getVisaApplicationStatus(applicationId: string) {
    return { status: 'awaiting_documents', applicationId };
  }
}

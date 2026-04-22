import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UnifiedInsurance, TravelVertical } from '../../../common/interfaces/unified-travel.interface';
import { PricingEngine } from '../../../common/utils/pricing.util';

@Injectable()
export class SafetyWingService {
  private readonly logger = new Logger(SafetyWingService.name);
  private readonly partnerId: string;

  constructor(private configService: ConfigService) {
    this.partnerId = this.configService.get<string>('SAFETYWING_PARTNER_ID') || '26515160';
  }

  async getInsuranceQuotes(tenantMarkup: number = 0): Promise<UnifiedInsurance[]> {
    this.logger.log('SafetyWing: Fetching insurance quotes');
    
    const basePrice = 42;
    const travsifyFee = 8;

    return [{
      id: 'sw-nomad',
      vertical: TravelVertical.INSURANCE,
      provider: 'SafetyWing',
      planName: 'Nomad Insurance',
      coverageDetails: {
        medicalLimit: '$250,000',
        deductible: '$250',
        repatriation: 'Included',
      },
      price: PricingEngine.calculate(basePrice, travsifyFee, tenantMarkup, 'USD'),
      bookingUrl: `https://safetywing.com/nomad-insurance?referenceID=${this.partnerId}`,
    }];
  }

  // Legacy method for DemoController
  async getQuotes(params: any, tenantMarkup: number = 0) {
    return this.getInsuranceQuotes(tenantMarkup);
  }
}

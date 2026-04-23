import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UnifiedInsurance, TravelVertical } from '../../../common/interfaces/unified-travel.interface';
import { PricingEngine } from '../../../common/utils/pricing.util';
import { CurrencyService } from '../../../common/services/currency.service';

@Injectable()
export class SafetyWingService {
  private readonly logger = new Logger(SafetyWingService.name);
  private readonly partnerId: string;

  constructor(
    private configService: ConfigService,
    private currencyService: CurrencyService
  ) {
    this.partnerId = this.configService.get<string>('SAFETYWING_PARTNER_ID') || '26515160';
  }

  async getInsuranceQuotes(params: any = {}, tenantMarkup: number = 0, targetCurrency: string = 'USD'): Promise<UnifiedInsurance[]> {
    this.logger.log('SafetyWing: Fetching dynamic insurance quotes');
    
    // Calculate days between start and end date, default to 28 days (standard month)
    let days = 28;
    if (params.startDate && params.endDate) {
      const start = new Date(params.startDate);
      const end = new Date(params.endDate);
      days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    }

    // SafetyWing Nomad is roughly $1.60 per day for age 10-39
    const basePrice = days * 1.60;
    const travsifyFee = Math.max(5, basePrice * 0.15); // 15% fee or min $5

    return [{
      id: 'sw-nomad',
      vertical: TravelVertical.INSURANCE,
      provider: 'SafetyWing',
      planName: 'Nomad Insurance',
      coverageDetails: {
        medicalLimit: '$250,000',
        deductible: '$250',
        repatriation: 'Included',
        duration: `${days} days`,
      },
      price: PricingEngine.calculate(basePrice, travsifyFee, tenantMarkup, 'USD', targetCurrency, this.currencyService),
      bookingUrl: `https://safetywing.com/nomad-insurance?referenceID=${this.partnerId}&utm_source=${this.partnerId}&utm_medium=affiliate`,
    }];
  }

  // Legacy method for DemoController
  async getQuotes(params: any, tenantMarkup: number = 0) {
    return this.getInsuranceQuotes(params, tenantMarkup);
  }
}

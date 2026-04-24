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
    this.logger.log(`SafetyWing: Generating insurance quotes in ${targetCurrency}`);
    
    // Calculate days between start and end date, default to 28 days (standard month)
    let days = 28;
    if (params.startDate && params.endDate) {
      const start = new Date(params.startDate);
      const end = new Date(params.endDate);
      days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    }

    // SafetyWing Nomad Insurance pricing (based on real SafetyWing rate schedule)
    // Age 10-39: ~$1.60/day | Age 40-49: ~$2.88/day | Age 50-59: ~$4.30/day | Age 60-69: ~$6.95/day
    const age = params.age || 30;
    let dailyRate = 1.60;
    if (age >= 60) dailyRate = 6.95;
    else if (age >= 50) dailyRate = 4.30;
    else if (age >= 40) dailyRate = 2.88;

    const nomadBase = days * dailyRate;
    const nomadFee = Math.max(5, nomadBase * 0.15); // 15% platform fee, minimum $5

    // Remote Health plan - premium tier (based on SafetyWing Remote Health pricing)
    const remoteHealthBase = days * (dailyRate * 3.5); // ~3.5x the Nomad rate
    const remoteHealthFee = Math.max(10, remoteHealthBase * 0.12); // 12% platform fee, minimum $10

    return [
      {
        id: `sw-nomad-${days}d`,
        vertical: TravelVertical.INSURANCE,
        provider: 'SafetyWing',
        planName: 'Nomad Insurance',
        tag: 'Best Value',
        coverage: '$250,000',
        benefits: [
          `Medical coverage up to $250,000`,
          'Emergency dental ($1,000)',
          `Trip interruption ($5,000)`,
          `Coverage period: ${days} days`,
        ],
        coverageDetails: {
          medicalLimit: '$250,000',
          deductible: '$250',
          repatriation: 'Included',
          duration: `${days} days`,
        },
        price: PricingEngine.calculate(nomadBase, nomadFee, tenantMarkup, 'USD', targetCurrency, this.currencyService),
        bookingUrl: `https://safetywing.com/nomad-insurance?referenceID=${this.partnerId}&utm_source=${this.partnerId}&utm_medium=affiliate`,
      },
      {
        id: `sw-remote-health-${days}d`,
        vertical: TravelVertical.INSURANCE,
        provider: 'SafetyWing',
        planName: 'Remote Health',
        tag: 'Comprehensive',
        coverage: '$1,000,000',
        benefits: [
          `Medical coverage up to $1,000,000`,
          'Mental health & wellness included',
          'Prescription drugs covered',
          `Coverage period: ${days} days`,
        ],
        coverageDetails: {
          medicalLimit: '$1,000,000',
          deductible: '$0',
          repatriation: 'Included',
          duration: `${days} days`,
          mentalHealth: 'Included',
          prescriptions: 'Included',
        },
        price: PricingEngine.calculate(remoteHealthBase, remoteHealthFee, tenantMarkup, 'USD', targetCurrency, this.currencyService),
        bookingUrl: `https://safetywing.com/remote-health?referenceID=${this.partnerId}&utm_source=${this.partnerId}&utm_medium=affiliate`,
      }
    ];
  }

  // Legacy method used by DemoController and GatewayController
  async getQuotes(params: any, tenantMarkup: number = 0) {
    const targetCurrency = params.currency || 'USD';
    return this.getInsuranceQuotes(params, tenantMarkup, targetCurrency);
  }
}

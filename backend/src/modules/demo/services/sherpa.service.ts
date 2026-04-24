import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UnifiedVisa, TravelVertical } from '../../../common/interfaces/unified-travel.interface';
import { PricingEngine } from '../../../common/utils/pricing.util';
import { CurrencyService } from '../../../common/services/currency.service';

@Injectable()
export class SherpaService {
  private readonly logger = new Logger(SherpaService.name);
  private readonly partnerId: string;

  constructor(
    private configService: ConfigService,
    private currencyService: CurrencyService
  ) {
    this.partnerId = this.configService.get<string>('SHERPA_PARTNER_ID') || 'travsify-visa';
  }

  async getVisaRequirements(params: { destination: string, nationality: string, currency?: string }, tenantMarkup: number = 0): Promise<UnifiedVisa[]> {
    const { destination, nationality, currency } = params;
    const targetCurrency = currency || 'USD';
    this.logger.log(`Sherpa: Fetching visa requirements for ${nationality} -> ${destination}`);
    
    const basePrice = 45; 
    const travsifyFee = 20;

    return [{
      id: `visa-${destination.toLowerCase()}`,
      vertical: TravelVertical.VISA,
      destination,
      nationality,
      requirements: ['Valid Passport', 'Biometric Photo', 'Letter of Invitation'],
      processingTime: '2-4 Business Days',
      price: PricingEngine.calculate(basePrice, travsifyFee, tenantMarkup, 'USD', targetCurrency, this.currencyService),
      bookingUrl: `https://apply.joinsherpa.com/apply?to=${destination}&from=${nationality}&affiliateId=${this.partnerId}`,
    }];
  }

  async bookVisa(data: any) {
    this.logger.log(`Sherpa: Initiating e-Visa application for ${data.destination}`);
    return {
       status: 'success',
       applicationId: `EV-${Math.random().toString(36).substring(7).toUpperCase()}`,
       provider: 'Sherpa'
    };
  }

  async getVisaApplicationStatus(applicationId: string) {
    return { status: 'awaiting_documents', applicationId };
  }
}

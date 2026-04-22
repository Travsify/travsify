import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UnifiedTransfer, TravelVertical } from '../../../common/interfaces/unified-travel.interface';
import { PricingEngine } from '../../../common/utils/pricing.util';

@Injectable()
export class MozioService {
  private readonly logger = new Logger(MozioService.name);
  private readonly affiliateId: string;

  constructor(private configService: ConfigService) {
    this.affiliateId = this.configService.get<string>('MOZIO_AFFILIATE_ID') || 'travsify';
  }

  async getTransferOptions(location: string, tenantMarkup: number = 0): Promise<UnifiedTransfer[]> {
    this.logger.log(`Mozio: Fetching transfer options for ${location}`);
    
    const basePrice = 45;
    const travsifyFee = 10;

    return [{
      id: `mozio-${Math.random().toString(36).substring(7)}`,
      vertical: TravelVertical.TRANSFER,
      provider: 'Mozio',
      vehicleType: 'Private Sedan',
      capacity: 4,
      price: PricingEngine.calculate(basePrice, travsifyFee, tenantMarkup, 'USD'),
      bookingUrl: `https://www.mozio.com/en-us/?ref=${this.affiliateId}&location=${location}`,
    }];
  }

  // Legacy methods for DemoController
  async searchTransfers(params: any) {
    return this.getTransferOptions(params.pickupAddress || 'London');
  }

  async getTransferStatus(searchId: string) {
    return { status: 'completed', searchId };
  }
}

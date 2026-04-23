import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UnifiedTransfer, TravelVertical } from '../../../common/interfaces/unified-travel.interface';
import { PricingEngine } from '../../../common/utils/pricing.util';
import { CurrencyService } from '../../../common/services/currency.service';

@Injectable()
export class MozioService {
  private readonly logger = new Logger(MozioService.name);
  private readonly affiliateId: string;

  constructor(
    private configService: ConfigService,
    private currencyService: CurrencyService
  ) {
    this.affiliateId = this.configService.get<string>('MOZIO_AFFILIATE_ID') || 'travsify';
  }

  async getTransferOptions(params: any, tenantMarkup: number = 0, targetCurrency: string = 'USD'): Promise<UnifiedTransfer[]> {
    const pickup = params.pickupAddress || 'London Heathrow (LHR)';
    const dropoff = params.dropoffAddress || 'Central London';
    this.logger.log(`Mozio: Fetching live-link options for ${pickup} → ${dropoff}`);
    
    const vehicles = [
      { type: 'Private Sedan', capacity: 3, base: 55, image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1000' },
      { type: 'Executive Van', capacity: 7, base: 95, image: 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&q=80&w=1000' },
      { type: 'Luxury Limo', capacity: 4, base: 180, image: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&q=80&w=1000' }
    ];

    return vehicles.map(v => ({
      id: `mozio-${Math.random().toString(36).substring(7)}`,
      vertical: TravelVertical.TRANSFER,
      provider: 'Mozio',
      vehicleType: v.type,
      capacity: v.capacity,
      image: v.image,
      price: PricingEngine.calculate(v.base, v.base * 0.15, tenantMarkup, 'USD', targetCurrency, this.currencyService),
      bookingUrl: `https://www.mozio.com/en-us/?ref=${this.affiliateId}&pickup_address=${encodeURIComponent(pickup)}&destination_address=${encodeURIComponent(dropoff)}`,
    }));
  }

  // Legacy methods for DemoController
  async searchTransfers(params: any, tenantMarkup: number = 0) {
    return this.getTransferOptions(params, tenantMarkup);
  }

  async getTransferStatus(searchId: string) {
    return { status: 'completed', searchId };
  }
}

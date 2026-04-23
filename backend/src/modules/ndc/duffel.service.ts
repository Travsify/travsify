import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { TravelVertical, UnifiedFlight } from '../../common/interfaces/unified-travel.interface';
import { PricingEngine } from '../../common/utils/pricing.util';
import { CurrencyService } from '../../common/services/currency.service';

@Injectable()
export class DuffelService {
  private readonly logger = new Logger(DuffelService.name);
  private readonly apiKey: string;
  private readonly apiUrl = 'https://api.duffel.com/air/offer_requests';

  constructor(
    private configService: ConfigService,
    private currencyService: CurrencyService
  ) {
    this.apiKey = this.configService.get<string>('DUFFEL_API_KEY') || '';
  }

  async searchFlights(
    criteria: { origin: string, destination: string, departureDate: string, adults: number },
    tenantMarkup: number,
    targetCurrency: string = 'NGN'
  ): Promise<UnifiedFlight[]> {
    if (!this.apiKey) {
      this.logger.warn('Duffel API Key is missing. Skipping search.');
      return [];
    }

    try {
      this.logger.log(`Duffel Search: ${criteria.origin} -> ${criteria.destination} (${targetCurrency})`);
      
      const payload = {
        data: {
          slices: [
            {
              origin: criteria.origin,
              destination: criteria.destination,
              departure_date: criteria.departureDate,
            },
          ],
          passengers: Array(criteria.adults).fill({ type: 'adult' }),
          cabin_class: 'economy',
        },
      };

      const response = await axios.post(this.apiUrl, payload, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Duffel-Version': 'v2',
          'Content-Type': 'application/json',
        },
      });

      const offers = response.data.data.offers || [];
      return this.mapDuffelOffers(offers, tenantMarkup, targetCurrency);
    } catch (error) {
      this.logger.error(`Duffel search failed: ${error.response?.data?.errors?.[0]?.message || error.message}`);
      return [];
    }
  }

  private mapDuffelOffers(offers: any[], tenantMarkup: number, targetCurrency: string): UnifiedFlight[] {
    return offers.map(offer => {
      const basePrice = parseFloat(offer.total_amount);
      const travsifyFee = basePrice * 0.03;

      // Extract conditions
      const isRefundable = offer.conditions?.refund_before_departure?.allowed === true;
      const fareRules = [];
      if (offer.conditions?.change_before_departure?.allowed) {
        fareRules.push(`Changes allowed (Penalty: ${offer.conditions.change_before_departure.penalty_amount || 'Free'})`);
      } else {
        fareRules.push('Non-changeable');
      }
      
      if (isRefundable) {
        fareRules.push(`Refundable (Penalty: ${offer.conditions.refund_before_departure.penalty_amount || 'Free'})`);
      } else {
        fareRules.push('Non-refundable');
      }

      return {
        id: offer.id,
        vertical: TravelVertical.FLIGHT,
        provider: 'Duffel',
        source: offer.id,
        isRefundable,
        fareRules,
        cabin: 'Economy',
        price: PricingEngine.calculate(
          basePrice, 
          travsifyFee, 
          tenantMarkup, 
          offer.total_currency, 
          targetCurrency, 
          this.currencyService
        ),
        segments: offer.slices[0].segments.map((s: any) => ({
          flightNumber: s.marketing_carrier_flight_number,
          airline: s.marketing_carrier.name,
          departure: s.origin.iata_code,
          arrival: s.destination.iata_code,
          departureTime: s.departing_at,
          arrivalTime: s.arriving_at,
        })),
      };
    });
  }
}

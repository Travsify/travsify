import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { TravelVertical, UnifiedFlight } from '../../common/interfaces/unified-travel.interface';
import { PricingEngine } from '../../common/utils/pricing.util';

@Injectable()
export class DuffelService {
  private readonly logger = new Logger(DuffelService.name);
  private readonly apiKey: string;
  private readonly apiUrl = 'https://api.duffel.com/air/offer_requests';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('DUFFEL_API_KEY') || '';
  }

  async searchFlights(
    criteria: { origin: string, destination: string, departureDate: string, adults: number },
    tenantMarkup: number
  ): Promise<UnifiedFlight[]> {
    if (!this.apiKey) {
      this.logger.warn('Duffel API Key is missing. Skipping search.');
      return [];
    }

    try {
      this.logger.log(`Duffel Search: ${criteria.origin} -> ${criteria.destination}`);
      
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
          'Duffel-Version': 'beta',
          'Content-Type': 'application/json',
        },
      });

      const offers = response.data.data.offers || [];
      return this.mapDuffelOffers(offers, tenantMarkup);
    } catch (error) {
      this.logger.error(`Duffel search failed: ${error.response?.data?.errors?.[0]?.message || error.message}`);
      return [];
    }
  }

  private mapDuffelOffers(offers: any[], tenantMarkup: number): UnifiedFlight[] {
    return offers.map(offer => {
      const basePrice = parseFloat(offer.total_amount);
      const travsifyFee = basePrice * 0.03;

      return {
        id: offer.id,
        vertical: TravelVertical.FLIGHT,
        provider: 'Duffel',
        source: offer.id,
        price: PricingEngine.calculate(basePrice, travsifyFee, tenantMarkup, offer.total_currency),
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

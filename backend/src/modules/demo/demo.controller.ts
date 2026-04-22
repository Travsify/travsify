import { Controller, Get, Post, Body, Query, Logger } from '@nestjs/common';
import { NdcService } from '../ndc/ndc.service';

@Controller('demo')
export class DemoController {
  private readonly logger = new Logger(DemoController.name);
  constructor(private readonly ndcService: NdcService) {}

  @Get('ping')
  ping() {
    this.logger.log('Ping received');
    return { status: 'ok', message: 'Demo service is online' };
  }

  @Post('flights/search')
  async searchFlights(@Body() criteria: any) {
    this.logger.log(`Flight search request: ${JSON.stringify(criteria)}`);
    // Default search if none provided for the demo "wow" factor
    const searchCriteria = criteria.origin ? criteria : {
      origin: 'LOS',
      destination: 'LHR',
      departureDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      adults: 1
    };
    return this.ndcService.airShopping(searchCriteria);
  }

  @Get('hotels/search')
  async searchHotels(@Query('location') location: string) {
    this.logger.log(`Hotel search request for location: ${location}`);
    return {
      results: [
        {
          id: 'h1',
          name: 'The Royal Travsify Suites',
          location: location || 'London, UK',
          price: 450,
          currency: 'USD',
          rating: 4.9,
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
          amenities: ['Pool', 'Spa', 'Free WiFi', 'Breakfast Included']
        },
        {
          id: 'h2',
          name: 'Global Executive Lodge',
          location: location || 'Dubai, UAE',
          price: 280,
          currency: 'USD',
          rating: 4.7,
          image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800',
          amenities: ['Gym', 'Airport Transfer', 'Meeting Rooms']
        }
      ]
    };
  }

  @Get('insurance/quotes')
  async getInsuranceQuotes() {
    return [
      { id: 'i1', plan: 'Basic Nomad', coverage: '$50k', price: 25 },
      { id: 'i2', plan: 'Global Elite', coverage: '$1M', price: 85 },
      { id: 'i3', plan: 'Travsify Business', coverage: '$500k', price: 55 },
    ];
  }
}

import { Controller, Get, Post, Body, Query, Headers, Logger } from '@nestjs/common';
import { NdcService } from '../ndc/ndc.service';
import { LiteApiService } from '../demo/services/liteapi.service';
import { TenantService } from '../tenant/tenant.service';
import { CheckoutService } from './checkout.service';
import { SherpaService } from '../demo/services/sherpa.service';
import { MozioService } from '../demo/services/mozio.service';
import { GetYourGuideService } from '../demo/services/getyourguide.service';
import { SafetyWingService } from '../demo/services/safetywing.service';

@Controller('api/v1')
export class GatewayController {
  private readonly logger = new Logger(GatewayController.name);

  constructor(
    private readonly tenantService: TenantService,
    private readonly ndcService: NdcService,
    private readonly liteApiService: LiteApiService,
    private readonly checkoutService: CheckoutService,
    private readonly sherpaService: SherpaService,
    private readonly mozioService: MozioService,
    private readonly gygService: GetYourGuideService,
    private readonly safetyWingService: SafetyWingService,
  ) {}

  @Post('checkout')
  async checkout(
    @Headers('x-api-key') apiKey: string,
    @Body() bookingData: any,
  ) {
    const tenant = await this.tenantService.validateApiKey(apiKey);
    return this.checkoutService.processBooking(tenant, bookingData);
  }

  @Post('search/flights')
  async searchFlights(
    @Headers('x-api-key') apiKey: string,
    @Body() criteria: any,
  ) {
    const tenant = await this.tenantService.validateApiKey(apiKey);
    const firstSegment = criteria.segments?.[0] || {};
    const searchCriteria = {
      origin: firstSegment.origin || criteria.origin || 'LOS',
      destination: firstSegment.destination || criteria.destination || 'LHR',
      departureDate: firstSegment.departureDate || criteria.departureDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      adults: criteria.adults || 1,
      currency: criteria.currency || 'NGN',
      cabinClass: criteria.cabinClass || 'economy',
    };
    return this.ndcService.airShopping(searchCriteria, tenant);
  }

  @Get('search/hotels')
  async searchHotels(
    @Headers('x-api-key') apiKey: string,
    @Query('city') city: string,
    @Query('checkin') checkin: string,
    @Query('checkout') checkout: string,
    @Query('adults') adults: string,
    @Query('currency') currency: string,
  ) {
    const tenant = await this.tenantService.validateApiKey(apiKey);
    return this.liteApiService.searchHotels({
      city,
      checkin,
      checkout,
      adults: parseInt(adults) || 1,
      currency: currency || 'NGN',
    }, tenant.hotelMarkup);
  }

  @Get('search/visa')
  async searchVisa(
    @Headers('x-api-key') apiKey: string,
    @Query('destination') destination: string,
    @Query('nationality') nationality: string,
    @Query('currency') currency: string,
  ) {
    const tenant = await this.tenantService.validateApiKey(apiKey);
    return this.sherpaService.getVisaRequirements({ destination, nationality, currency: currency || 'NGN' }, tenant.insuranceMarkup);
  }

  @Post('search/transfers')
  async searchTransfers(
    @Headers('x-api-key') apiKey: string,
    @Body() criteria: any,
  ) {
    const tenant = await this.tenantService.validateApiKey(apiKey);
    return this.mozioService.searchTransfers({
      pickupAddress: criteria.pickup || criteria.pickupAddress || 'Heathrow Airport (LHR)',
      dropoffAddress: criteria.dropoff || criteria.dropoffAddress || 'Central London',
      pickupDatetime: criteria.time || criteria.pickupDatetime || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      passengers: criteria.passengers || 1,
      currency: criteria.currency || 'USD',
    }, tenant.hotelMarkup);
  }

  @Get('search/tours')
  async searchTours(
    @Headers('x-api-key') apiKey: string,
    @Query('location') location: string,
    @Query('currency') currency: string,
  ) {
    const tenant = await this.tenantService.validateApiKey(apiKey);
    return this.gygService.getTours(location, tenant.hotelMarkup, currency || 'USD');
  }

  @Post('search/insurance')
  async searchInsurance(
    @Headers('x-api-key') apiKey: string,
    @Body() criteria: any,
  ) {
    const tenant = await this.tenantService.validateApiKey(apiKey);
    return this.safetyWingService.getQuotes({
      destination: criteria.destination || 'Worldwide',
      startDate: criteria.startDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: criteria.endDate || new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      age: criteria.age || 30,
      citizenship: criteria.citizenship || 'NG',
      currency: criteria.currency || 'USD',
    }, tenant.insuranceMarkup);
  }

  @Get('search/all')
  async unifiedSearch(@Headers('x-api-key') apiKey: string, @Query('location') location: string) {
    const tenant = await this.tenantService.validateApiKey(apiKey);
    const [flights, hotels, tours, transfers, insurance] = await Promise.all([
      this.ndcService.airShopping({ origin: 'LOS', destination: location || 'LHR', departureDate: '2026-05-01', adults: 1 }, tenant),
      this.liteApiService.searchHotels({ city: location || 'London', checkin: '2026-05-01', checkout: '2026-05-05', adults: 1 }, tenant.hotelMarkup),
      this.gygService.getTours(location || 'London', tenant.hotelMarkup),
      this.mozioService.getTransferOptions(location || 'London', tenant.hotelMarkup),
      this.safetyWingService.getInsuranceQuotes(tenant.insuranceMarkup),
    ]);

    return {
      location: location || 'Global',
      results: {
        flights,
        hotels,
        tours,
        transfers,
        insurance,
      }
    };
  }
}

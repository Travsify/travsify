import { Controller, Get, Post, Body, Query, Headers, Logger } from '@nestjs/common';
import { NdcService } from '../ndc/ndc.service';
import { LiteApiService } from '../demo/services/liteapi.service';
import { TenantService } from '../tenant/tenant.service';
import { CheckoutService } from './checkout.service';
import { AtlysService } from '../demo/services/atlys.service';
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
    private readonly atlysService: AtlysService,
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

  @Get('search/flights')
  async searchFlights(
    @Headers('x-api-key') apiKey: string,
    @Query('origin') origin: string,
    @Query('destination') destination: string,
    @Query('date') date: string,
    @Query('adults') adults: string,
  ) {
    const tenant = await this.tenantService.validateApiKey(apiKey);
    return this.ndcService.airShopping({
      origin,
      destination,
      departureDate: date,
      adults: parseInt(adults) || 1,
    }, tenant.flightMarkup);
  }

  @Get('search/hotels')
  async searchHotels(
    @Headers('x-api-key') apiKey: string,
    @Query('city') city: string,
    @Query('checkin') checkin: string,
    @Query('checkout') checkout: string,
    @Query('adults') adults: string,
  ) {
    const tenant = await this.tenantService.validateApiKey(apiKey);
    return this.liteApiService.searchHotels({
      city,
      checkin,
      checkout,
      adults: parseInt(adults) || 1,
    }, tenant.hotelMarkup);
  }

  @Get('search/visa')
  async searchVisa(
    @Headers('x-api-key') apiKey: string,
    @Query('destination') destination: string,
    @Query('nationality') nationality: string,
  ) {
    const tenant = await this.tenantService.validateApiKey(apiKey);
    return this.atlysService.getVisaRequirements({ destination, nationality }, tenant.insuranceMarkup);
  }

  @Get('search/transfers')
  async searchTransfers(
    @Headers('x-api-key') apiKey: string,
    @Query('location') location: string,
  ) {
    const tenant = await this.tenantService.validateApiKey(apiKey);
    return this.mozioService.getTransferOptions(location, tenant.hotelMarkup);
  }

  @Get('search/tours')
  async searchTours(
    @Headers('x-api-key') apiKey: string,
    @Query('location') location: string,
  ) {
    const tenant = await this.tenantService.validateApiKey(apiKey);
    return this.gygService.getTours(location, tenant.hotelMarkup);
  }

  @Get('search/insurance')
  async searchInsurance(@Headers('x-api-key') apiKey: string) {
    const tenant = await this.tenantService.validateApiKey(apiKey);
    return this.safetyWingService.getInsuranceQuotes(tenant.insuranceMarkup);
  }
}

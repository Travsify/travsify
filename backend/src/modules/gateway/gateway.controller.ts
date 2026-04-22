import { Controller, Get, Query, Headers, Logger, UnauthorizedException } from '@nestjs/common';
import { NdcService } from '../ndc/ndc.service';
import { LiteApiService } from '../demo/services/liteapi.service';
import { TenantService } from '../tenant/tenant.service';

@Controller('api/v1')
export class GatewayController {
  private readonly logger = new Logger(GatewayController.name);

  constructor(
    private readonly tenantService: TenantService,
    private readonly ndcService: NdcService,
    private readonly liteApiService: LiteApiService,
    private readonly checkoutService: CheckoutService,
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
    this.logger.log(`Tenant ${tenant.name} searching flights: ${origin} -> ${destination}`);
    
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
    this.logger.log(`Tenant ${tenant.name} searching hotels: ${city}`);

    return this.liteApiService.searchHotels({
      city,
      checkin,
      checkout,
      adults: parseInt(adults) || 1,
    }, tenant.hotelMarkup);
  }
}

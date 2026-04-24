import { Controller, Get, Post, Body, Query, Logger } from '@nestjs/common';
import { NdcService } from '../ndc/ndc.service';
import { LiteApiService } from './services/liteapi.service';
import { ShepperService } from './services/shepper.service';
import { GetYourGuideService } from './services/getyourguide.service';
import { MozioService } from './services/mozio.service';
import { SafetyWingService } from './services/safetywing.service';
import { SherpaService } from './services/sherpa.service';

@Controller('demo')
export class DemoController {
  private readonly logger = new Logger(DemoController.name);

  constructor(
    private readonly ndcService: NdcService,
    private readonly liteApiService: LiteApiService,
    private readonly sherpaService: SherpaService,
    private readonly getYourGuideService: GetYourGuideService,
    private readonly mozioService: MozioService,
    private readonly safetyWingService: SafetyWingService,
  ) {}

  // ─── Health ───────────────────────────────────────────────
  @Get('ping')
  ping() {
    this.logger.log('Ping received');
    return {
      status: 'ok',
      message: 'Travsify API Gateway is online',
      services: ['flights', 'hotels', 'visa', 'experiences', 'transfers', 'insurance'],
      timestamp: new Date().toISOString(),
    };
  }

  // ─── ✈️ Flights (SME.ng NDC) ─────────────────────────
  @Post('flights/search')
  async searchFlights(@Body() criteria: any) {
    this.logger.log(`Flight search request: ${JSON.stringify(criteria)}`);
    const searchCriteria = criteria.origin ? criteria : {
      origin: 'LOS',
      destination: 'LHR',
      departureDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      adults: 1,
    };
    const demoTenant = { flightMarkup: 0, flightProvider: 'duffel', ndcEnabled: false };
    return this.ndcService.airShopping(searchCriteria, demoTenant);
  }

  // ─── 🏨 Hotels (LiteAPI) ─────────────────────────────────
  @Get('hotels/search')
  async searchHotels(
    @Query('city') city: string,
    @Query('checkin') checkin: string,
    @Query('checkout') checkout: string,
    @Query('adults') adults: string,
    @Query('currency') currency: string,
  ) {
    this.logger.log(`Hotel search: ${city}`);
    const today = new Date();
    const defaultCheckin = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const defaultCheckout = new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    return this.liteApiService.searchHotels({
      city: city || 'London',
      checkin: checkin || defaultCheckin,
      checkout: checkout || defaultCheckout,
      adults: parseInt(adults) || 1,
      currency: currency || 'USD',
    });
  }

  @Get('hotels/:hotelId')
  async getHotelDetails(@Query('hotelId') hotelId: string) {
    return this.liteApiService.getHotelDetails(hotelId);
  }

  // ─── 🛂 Visa / eVisa (Sherpa) ─────────────────────────────
  @Get('visa/requirements')
  async getVisaRequirements(
    @Query('nationality') nationality: string,
    @Query('destination') destination: string,
  ) {
    this.logger.log(`Visa check: ${nationality} → ${destination}`);
    return this.sherpaService.getVisaRequirements({
      nationality: nationality || 'NG',
      destination: destination || 'GB',
    });
  }

  @Get('visa/status/:applicationId')
  async getVisaStatus(@Query('applicationId') applicationId: string) {
    return this.sherpaService.getVisaApplicationStatus(applicationId);
  }

  // ─── 🎭 Experiences & Tours (GetYourGuide) ───────────────
  @Get('experiences/search')
  async searchExperiences(
    @Query('city') city: string,
    @Query('date') date: string,
    @Query('category') category: string,
    @Query('limit') limit: string,
  ) {
    this.logger.log(`Experience search: ${city}`);
    return this.getYourGuideService.searchActivities({
      city: city || 'London',
      date,
      category,
      limit: parseInt(limit) || 10,
    });
  }

  @Get('experiences/:activityId')
  async getExperienceDetails(@Query('activityId') activityId: string) {
    return this.getYourGuideService.getActivityDetails(activityId);
  }

  // ─── 🚗 Airport Transfers (Mozio) ────────────────────────
  @Post('transfers/search')
  async searchTransfers(@Body() criteria: any) {
    this.logger.log(`Transfer search: ${criteria.pickupAddress} → ${criteria.dropoffAddress}`);
    const defaultDatetime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    return this.mozioService.searchTransfers({
      pickupAddress: criteria.pickupAddress || 'Heathrow Airport (LHR)',
      dropoffAddress: criteria.dropoffAddress || 'Central London',
      pickupDatetime: criteria.pickupDatetime || defaultDatetime,
      passengers: criteria.passengers || 1,
      currency: criteria.currency || 'USD',
    });
  }

  @Get('transfers/status/:searchId')
  async getTransferStatus(@Query('searchId') searchId: string) {
    return this.mozioService.getTransferStatus(searchId);
  }

  // ─── 🛡️ Travel Insurance (SafetyWing) ────────────────────
  @Get('insurance/quotes')
  async getInsuranceQuotes(
    @Query('destination') destination: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('age') age: string,
    @Query('citizenship') citizenship: string,
  ) {
    this.logger.log(`Insurance quote: ${destination}`);
    const today = new Date();
    const defaultStart = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const defaultEnd = new Date(today.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    return this.safetyWingService.getQuotes({
      destination: destination || 'Worldwide',
      startDate: startDate || defaultStart,
      endDate: endDate || defaultEnd,
      age: parseInt(age) || 30,
      citizenship: citizenship || 'NG',
    });
  }
}

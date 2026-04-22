import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiKeyGuard } from '../../common/guards/api-key.guard';
import { NdcService } from '../ndc/ndc.service';

@Controller('bookings')
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
    private readonly ndcService: NdcService,
  ) {}

  /**
   * Search for flights (Proxy to NDC service)
   */
  @UseGuards(JwtAuthGuard)
  @Post('search')
  async search(@Body() searchCriteria: any) {
    return this.ndcService.airShopping(searchCriteria);
  }

  /**
   * Reconfirm price (Pre-booking)
   */
  @UseGuards(JwtAuthGuard)
  @Post('price')
  async getPrice(@Body() data: { offerCode: string, searchGuid: string }) {
    return this.ndcService.offerPrice(data.offerCode, data.searchGuid);
  }

  /**
   * Create a full booking (Reserve + Ticket)
   */
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Request() req: any, @Body() bookingData: any) {
    return this.bookingsService.createBooking(req.user.id, bookingData);
  }

  /**
   * Get user booking history
   */
  @UseGuards(JwtAuthGuard)
  @Get('my-bookings')
  async getMyBookings(@Request() req: any) {
    return this.bookingsService.getUserBookings(req.user.id);
  }

  /**
   * External B2B API Endpoint (using API Key)
   */
  @UseGuards(ApiKeyGuard)
  @Post('external/search')
  async externalSearch(@Body() searchCriteria: any) {
    return this.ndcService.airShopping(searchCriteria);
  }
}

import { Controller, Get, Post, Body, Param, UseGuards, Req, Patch } from '@nestjs/common';
import { SupportService } from './support.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TicketStatus } from './entities/support-ticket.entity';

@Controller('support')
@UseGuards(JwtAuthGuard)
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post('tickets')
  async createTicket(@Req() req: any, @Body() data: any) {
    return this.supportService.createTicket(req.user.id, data);
  }

  @Get('tickets')
  async getTickets(@Req() req: any) {
    return this.supportService.findByUserId(req.user.id);
  }

  @Get('tickets/:id')
  async getTicket(@Param('id') id: string) {
    return this.supportService.findById(id);
  }

  @Patch('tickets/:id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: TicketStatus) {
    return this.supportService.updateStatus(id, status);
  }
}

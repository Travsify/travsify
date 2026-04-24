import { Controller, Get, UseGuards, Query, Req } from '@nestjs/common';
import { ApiLogsService } from './api-logs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('developer/logs')
@UseGuards(JwtAuthGuard)
export class ApiLogsController {
  constructor(private readonly apiLogsService: ApiLogsService) {}

  @Get()
  async getLogs(@Req() req: any, @Query('limit') limit?: number) {
    return this.apiLogsService.findByUserId(req.user.id, limit);
  }

  @Get('stats')
  async getStats(@Req() req: any) {
    return this.apiLogsService.getStats(req.user.id);
  }
}

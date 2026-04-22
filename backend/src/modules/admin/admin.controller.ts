import { Controller, Post, Get, Body, Param, Put, Logger } from '@nestjs/common';
import { TenantService } from '../tenant/tenant.service';
import { Tenant } from '../tenant/tenant.entity';

@Controller('admin')
export class AdminController {
  private readonly logger = new Logger(AdminController.name);

  constructor(private readonly tenantService: TenantService) {}

  @Post('tenants')
  async createTenant(@Body() data: Partial<Tenant>) {
    this.logger.log(`Admin: Creating new tenant ${data.name}`);
    return this.tenantService.createTenant(data);
  }

  @Get('analytics/summary')
  async getGlobalAnalytics() {
    // This would normally query transaction logs
    return {
      totalBookings: 1240,
      totalRevenue: 520000,
      activeTenants: 15,
      popularVerticals: {
        flights: 850,
        hotels: 300,
        insurance: 90
      }
    };
  }
}

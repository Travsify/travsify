import { Controller, Post, Get, Body, Param, Put, Logger } from '@nestjs/common';
import { TenantService } from '../tenant/tenant.service';
import { Tenant } from '../tenant/tenant.entity';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Controller('admin')
export class AdminController {
  private readonly logger = new Logger(AdminController.name);

  constructor(
    private readonly tenantService: TenantService,
    private readonly usersService: UsersService,
  ) {}

  @Post('tenants')
  async create(@Body() data: Partial<Tenant>) {
    this.logger.log(`Admin: Creating new tenant ${data.name}`);
    return this.tenantService.create(data as any);
  }

  @Get('tenants')
  async listTenants() {
    this.logger.log('Admin: Fetching all tenants');
    return this.tenantService.findAll();
  }

  @Get('setup')
  async setupAdmin() {
    this.logger.log('Admin: One-time setup initiated');
    const adminEmail = 'admin@travsify.com';
    const adminPassword = 'TravsifyMaster2026!';
    
    try {
      // 1. Check if admin exists
      const existing = await this.usersService.findByEmail(adminEmail);
      if (existing) {
        this.logger.warn('Setup denied: Platform already initialized');
        return { status: 'denied', message: 'Platform is already initialized.' };
      }

      // 2. Create Admin User
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const user = await this.usersService.create({
        email: adminEmail,
        password: hashedPassword,
        businessName: 'Travsify HQ',
        role: 'admin' as any,
        status: 'approved' as any
      });

      // 3. Create Tenant
      await this.tenantService.create({
        name: 'Travsify HQ',
        email: adminEmail
      });

      this.logger.log('Admin: Master account provisioned successfully');
      return {
        status: 'success',
        message: 'Master Admin provisioned.',
        credentials: { email: adminEmail, password: adminPassword }
      };
    } catch (error) {
      this.logger.error(`Setup failed: ${error.message}`);
      return { status: 'error', message: error.message };
    }
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

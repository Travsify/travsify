import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyTenant(@Request() req: any) {
    return this.tenantService.findByEmail(req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Post('rotate-key')
  async rotateKey(@Request() req: any) {
    return this.tenantService.rotateApiKey(req.user.email);
  }
}

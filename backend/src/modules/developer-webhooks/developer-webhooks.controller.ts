import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { DeveloperWebhooksService } from './developer-webhooks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('developer/webhooks')
@UseGuards(JwtAuthGuard)
export class DeveloperWebhooksController {
  constructor(private readonly webhooksService: DeveloperWebhooksService) {}

  @Get()
  async getWebhooks(@Req() req: any) {
    return this.webhooksService.findByUserId(req.user.id);
  }

  @Post()
  async createWebhook(@Req() req: any, @Body() data: { url: string; events: string[]; description?: string }) {
    return this.webhooksService.createWebhook(req.user.id, data);
  }

  @Delete(':id')
  async deleteWebhook(@Param('id') id: string) {
    return this.webhooksService.deleteWebhook(id);
  }

  @Post(':id/test')
  async testWebhook(@Param('id') id: string) {
    return this.webhooksService.testWebhook(id);
  }
}

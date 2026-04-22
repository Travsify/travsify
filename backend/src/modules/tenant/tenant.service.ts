import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from './tenant.entity';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
  ) {}

  async validateApiKey(apiKey: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOne({ where: { apiKey, isActive: true } });
    if (!tenant) {
      throw new UnauthorizedException('Invalid or inactive API Key');
    }
    return tenant;
  }

  async createTenant(data: Partial<Tenant>): Promise<Tenant> {
    const tenant = this.tenantRepository.create({
      ...data,
      apiKey: this.generateApiKey(),
    });
    return this.tenantRepository.save(tenant);
  }

  private generateApiKey(): string {
    return 'tx_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}

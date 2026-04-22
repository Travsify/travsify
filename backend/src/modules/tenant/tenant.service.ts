import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
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

  async findByEmail(email: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOne({ where: { email } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    return tenant;
  }

  async create(data: { name: string, email: string }): Promise<Tenant> {
    const tenant = this.tenantRepository.create({
      name: data.name,
      email: data.email,
      apiKey: this.generateApiKey(),
      flightMarkup: 0,
      hotelMarkup: 0,
      insuranceMarkup: 0,
    });
    return this.tenantRepository.save(tenant);
  }

  async rotateApiKey(email: string): Promise<Tenant> {
    const tenant = await this.findByEmail(email);
    tenant.apiKey = this.generateApiKey();
    return this.tenantRepository.save(tenant);
  }

  private generateApiKey(): string {
    return 'tx_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}

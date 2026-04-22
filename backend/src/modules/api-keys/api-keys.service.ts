import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKey } from './entities/api-key.entity';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

@Injectable()
export class ApiKeysService {
  constructor(
    @InjectRepository(ApiKey)
    private apiKeyRepository: Repository<ApiKey>,
  ) {}

  async createKey(userId: string): Promise<ApiKey> {
    const publicKey = 'pk_' + crypto.randomBytes(16).toString('hex');
    const secretKey = 'sk_' + crypto.randomBytes(32).toString('hex');

    const apiKey = this.apiKeyRepository.create({
      userId,
      publicKey,
      secretKey,
    });

    return this.apiKeyRepository.save(apiKey);
  }

  async findByPublicKey(publicKey: string): Promise<ApiKey | null> {
    return this.apiKeyRepository.findOne({ where: { publicKey, isActive: true }, relations: ['user'] });
  }

  async findByUserId(userId: string): Promise<ApiKey[]> {
    return this.apiKeyRepository.find({ where: { userId } });
  }

  async revokeKey(id: string): Promise<void> {
    await this.apiKeyRepository.update(id, { isActive: false });
  }

  async validateKey(publicKey: string, secretKey: string): Promise<ApiKey | null> {
    const key = await this.apiKeyRepository.findOne({ 
      where: { publicKey, secretKey, isActive: true },
      relations: ['user']
    });
    return key || null;
  }
}

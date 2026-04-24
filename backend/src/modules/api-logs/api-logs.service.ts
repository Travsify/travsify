import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiLog } from './entities/api-log.entity';

@Injectable()
export class ApiLogsService {
  constructor(
    @InjectRepository(ApiLog)
    private apiLogRepository: Repository<ApiLog>,
  ) {}

  async logRequest(data: Partial<ApiLog>): Promise<ApiLog> {
    const log = this.apiLogRepository.create(data);
    return this.apiLogRepository.save(log);
  }

  async findByUserId(userId: string, limit: number = 50): Promise<ApiLog[]> {
    return this.apiLogRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getStats(userId: string) {
    const logs = await this.apiLogRepository.find({ where: { userId } });
    const total = logs.length;
    const success = logs.filter(l => l.statusCode >= 200 && l.statusCode < 300).length;
    const error = total - success;
    const avgLatency = total > 0 ? logs.reduce((acc, l) => acc + (l.latency || 0), 0) / total : 0;

    return { total, success, error, avgLatency: Math.round(avgLatency) };
  }
}

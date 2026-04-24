import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiLog } from './entities/api-log.entity';
import { ApiLogsService } from './api-logs.service';
import { ApiLogsController } from './api-logs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ApiLog])],
  providers: [ApiLogsService],
  controllers: [ApiLogsController],
  exports: [ApiLogsService],
})
export class ApiLogsModule {}

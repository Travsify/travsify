import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiLogsService } from '../../modules/api-logs/api-logs.service';

@Injectable()
export class ApiLoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ApiLoggerInterceptor.name);

  constructor(private readonly apiLogsService: ApiLogsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, query, ip, headers } = request;
    const userAgent = headers['user-agent'];
    const apiKey = headers['x-api-key'];

    // Only log if an API Key is present (developer requests)
    if (!apiKey) return next.handle();

    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: (responseBody) => {
          const latency = Date.now() - startTime;
          const statusCode = context.switchToHttp().getResponse().statusCode;
          const user = request.user; // Set by JwtAuthGuard or ApiKeyGuard

          if (user) {
            this.apiLogsService.logRequest({
              userId: user.id,
              method,
              path: url,
              query,
              body,
              response: responseBody,
              statusCode,
              ipAddress: ip,
              userAgent,
              latency,
              environment: apiKey.startsWith('pk_live') ? 'live' : 'sandbox',
            }).catch(err => this.logger.error('Failed to save API log', err));
          }
        },
        error: (err) => {
          const latency = Date.now() - startTime;
          const statusCode = err.status || 500;
          const user = request.user;

          if (user) {
            this.apiLogsService.logRequest({
              userId: user.id,
              method,
              path: url,
              query,
              body,
              response: { error: err.message, stack: err.stack },
              statusCode,
              ipAddress: ip,
              userAgent,
              latency,
              environment: apiKey.startsWith('pk_live') ? 'live' : 'sandbox',
            }).catch(err => this.logger.error('Failed to save API error log', err));
          }
        }
      })
    );
  }
}

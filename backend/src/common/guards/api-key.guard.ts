import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ApiKeysService } from '../../modules/api-keys/api-keys.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private apiKeysService: ApiKeysService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const publicKey = request.headers['x-api-key'];
    const secretKey = request.headers['x-api-secret'];

    if (!publicKey || !secretKey) {
      throw new UnauthorizedException('API keys missing');
    }

    const apiKey = await this.apiKeysService.validateKey(publicKey as string, secretKey as string);
    if (!apiKey) {
      throw new UnauthorizedException('Invalid API keys');
    }

    request.user = apiKey.user;
    return true;
  }
}

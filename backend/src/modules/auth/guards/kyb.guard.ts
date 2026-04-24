import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserStatus } from '../../users/entities/user.entity';

@Injectable()
export class KybGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    if (user.status !== UserStatus.APPROVED) {
      throw new ForbiddenException('Your account is not yet verified. Please complete the KYB process and wait for admin approval.');
    }

    return true;
  }
}

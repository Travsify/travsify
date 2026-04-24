import { Controller, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('profile')
  async updateProfile(@Req() req: any, @Body() updateData: { businessName?: string; email?: string }) {
    return this.usersService.update(req.user.id, updateData);
  }
}

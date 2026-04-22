import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private tenantService: TenantService,
  ) {}

  async register(userData: any): Promise<any> {
    const { password, businessName, email, ...rest } = userData;
    
    // 1. Create the user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({
      ...rest,
      email,
      businessName,
      password: hashedPassword,
    });

    // 2. Create the associated Tenant (B2B Account)
    await this.tenantService.create({
      name: businessName,
      email: email,
    });

    return this.login(user);
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        businessName: user.businessName,
        status: user.status,
      },
    };
  }
}

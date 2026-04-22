import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/modules/users/users.service';
import { TenantService } from '../src/modules/tenant/tenant.service';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);
  const tenantService = app.get(TenantService);

  const adminEmail = 'admin@travsify.com';
  const adminPassword = 'TravsifyMaster2026!';
  
  try {
    console.log('🚀 Seeding Master Admin...');

    // 1. Check if exists
    const existing = await usersService.findByEmail(adminEmail);
    if (existing) {
      console.log('⚠️ Admin already exists.');
    } else {
      // 2. Create Admin User
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await usersService.create({
        email: adminEmail,
        password: hashedPassword,
        businessName: 'Travsify HQ',
        role: 'admin' as any,
        status: 'approved' as any
      });

      // 3. Create Associated Tenant
      await tenantService.create({
        name: 'Travsify HQ',
        email: adminEmail
      });

      console.log('✅ Master Admin seeded successfully!');
    }
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    await app.close();
  }
}

bootstrap();

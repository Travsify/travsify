const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/src/app.module');
const { UsersService } = require('../dist/src/modules/users/users.service');
const { TenantService } = require('../dist/src/modules/tenant/tenant.service');
const bcrypt = require('bcrypt');

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);
  const tenantService = app.get(TenantService);

  const adminEmail = 'admin@travsify.com';
  const adminPassword = 'TravsifyMaster2026!';
  
  try {
    console.log('🚀 Seeding Master Admin (JS)...');

    const existing = await usersService.findByEmail(adminEmail);
    if (existing) {
      console.log('⚠️ Admin already exists.');
    } else {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await usersService.create({
        email: adminEmail,
        password: hashedPassword,
        businessName: 'Travsify HQ',
        role: 'admin',
        status: 'approved'
      });

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

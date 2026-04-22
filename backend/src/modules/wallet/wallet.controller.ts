import { Controller, Get, UseGuards, Request, Post, Body } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Currency } from './entities/wallet.entity';

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  async getWallets(@Request() req: any) {
    return this.walletService.findUserWallets(req.user.id);
  }

  @Get('transactions')
  async getTransactions(@Request() req: any) {
    // We'll need to add findUserTransactions to WalletService
    // For now, let's just implement the service method first or call it if it exists.
    // Wait, I should check WalletService again.
    return this.walletService.findUserTransactions(req.user.id);
  }
}

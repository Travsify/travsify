import { Controller, Get, UseGuards, Request, Post, Body } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Currency } from './entities/wallet.entity';
import { StripeService } from '../demo/services/stripe.service';

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly stripeService: StripeService
  ) {}

  @Post('link-card')
  async linkCard(@Request() req: any) {
    return this.stripeService.createSetupSession(req.user.email);
  }

  @Get()
  async getWallets(@Request() req: any) {
    return this.walletService.findUserWallets(req.user.id);
  }

  @Get('transactions')
  async getTransactions(@Request() req: any) {
    return this.walletService.findUserTransactions(req.user.id);
  }

  @Post('fund')
  async fundWallet(@Request() req: any, @Body() body: { amount: number, currency: Currency }) {
    const { amount, currency } = body;
    
    if (currency === Currency.USD) {
      // Initiate Stripe session for USD funding
      return this.stripeService.createCheckoutSession({
        amount,
        currency: 'usd',
        description: 'Wallet Funding - USD',
        email: req.user.email,
        metadata: { userId: req.user.id, type: 'wallet_fund' }
      });
    }

    // For NGN: Direct credit for demo, but instructions are provided in UI.
    return this.walletService.creditWallet(
      req.user.id, 
      currency, 
      amount, 
      `fund_${Date.now()}`,
      { description: 'Wallet Funding via Direct Transfer', method: 'Direct' }
    );
  }

  @Post('withdraw')
  async withdraw(@Request() req: any, @Body() body: { amount: number, currency: Currency }) {
    const { amount, currency } = body;
    return this.walletService.debitWallet(
      req.user.id, 
      currency, 
      amount, 
      `with_${Date.now()}`,
      { description: 'Wallet Withdrawal', method: 'Bank Transfer' }
    );
  }

  @Post('convert')
  async convert(@Request() req: any, @Body() body: { from: Currency, to: Currency, amount: number }) {
    const { from, to, amount } = body;
    return this.walletService.convertCurrency(req.user.id, from, to, amount);
  }
}

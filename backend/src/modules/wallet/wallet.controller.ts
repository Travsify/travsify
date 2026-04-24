import { Controller, Get, UseGuards, Request, Post, Body, Query, BadRequestException, Req, Headers } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Currency } from './entities/wallet.entity';
import { StripeService } from '../demo/services/stripe.service';
import { FincraService } from '../demo/services/fincra.service';
import { NotificationService } from '../notifications/notification.service';
import { ConfigService } from '@nestjs/config';

@Controller('wallet')
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly stripeService: StripeService,
    private readonly fincraService: FincraService,
    private readonly notificationService: NotificationService,
    private readonly configService: ConfigService,
  ) {}

  // ─── Card Linking via Stripe Setup ───────────────────────
  @Post('link-card')
  @UseGuards(JwtAuthGuard)
  async linkCard(@Request() req: any) {
    return this.stripeService.createSetupSession(req.user.email);
  }

  // ─── Wallet Listing ──────────────────────────────────────
  @Get()
  @UseGuards(JwtAuthGuard)
  async getWallets(@Request() req: any) {
    return this.walletService.findUserWallets(req.user.id);
  }

  // ─── Transaction History ─────────────────────────────────
  @Get('transactions')
  @UseGuards(JwtAuthGuard)
  async getTransactions(@Request() req: any) {
    return this.walletService.findUserTransactions(req.user.id);
  }

  // ─── Revenue Stats ───────────────────────────────────────
  @Get('revenue-stats')
  @UseGuards(JwtAuthGuard)
  async getRevenueStats(@Request() req: any, @Query('period') period: string = 'daily') {
    return this.walletService.getRevenueStats(req.user.id, period as 'daily' | 'weekly' | 'monthly');
  }

  // ─── Wallet Funding ──────────────────────────────────────
  @Post('fund')
  @UseGuards(JwtAuthGuard)
  async fundWallet(@Request() req: any, @Body() body: { amount: number, currency: Currency }) {
    const { amount, currency } = body;

    if (!amount || amount <= 0) throw new BadRequestException('Invalid amount');

    if (currency === Currency.USD) {
      // USD funding via Stripe Checkout
      return this.stripeService.createCheckoutSession({
        amount,
        currency: 'usd',
        description: `Wallet Funding - ${amount} USD`,
        email: req.user.email,
        metadata: { userId: req.user.id, type: 'wallet_fund', walletCurrency: 'USD' }
      });
    }

    if (currency === Currency.NGN) {
      // NGN funding via Fincra Checkout
      const reference = `fund_ngn_${Date.now()}_${req.user.id.slice(0, 6)}`;
      const result = await this.fincraService.createPaymentLink({
        amount,
        currency: 'NGN',
        email: req.user.email,
        reference,
        metadata: { userId: req.user.id, type: 'wallet_fund', walletCurrency: 'NGN' }
      });

      if (result?.data?.link || result?.link) {
        return { status: 'success', link: result?.data?.link || result?.link, reference };
      }

      // Fallback: manual bank transfer (credit pending)
      return this.walletService.creditWallet(
        req.user.id,
        currency,
        amount,
        reference,
        { description: 'Wallet Funding via Direct Transfer', method: 'Direct' }
      );
    }

    throw new BadRequestException('Unsupported currency');
  }

  // ─── Wallet Withdrawal ───────────────────────────────────
  @Post('withdraw')
  @UseGuards(JwtAuthGuard)
  async withdraw(
    @Request() req: any,
    @Body() body: {
      amount: number;
      currency: Currency;
      bankCode?: string;
      accountNumber?: string;
      accountName?: string;
    }
  ) {
    const { amount, currency, bankCode, accountNumber, accountName } = body;

    if (!amount || amount <= 0) throw new BadRequestException('Invalid amount');

    if (currency === Currency.NGN && bankCode && accountNumber) {
      // NGN withdrawal via Fincra payout
      const reference = `with_ngn_${Date.now()}_${req.user.id.slice(0, 6)}`;

      // 1. Debit the wallet first
      const debitTx = await this.walletService.debitWallet(
        req.user.id,
        currency,
        amount,
        reference,
        { description: 'Wallet Withdrawal to Bank', method: 'Fincra Payout', bankCode, accountNumber }
      );

      // 2. Initiate payout via Fincra
      const payoutResult = await this.fincraService.initiatePayout({
        amount,
        currency: 'NGN',
        bankCode,
        accountNumber,
        accountName: accountName || req.user.name || 'Travsify User',
        reference,
        narration: `Travsify withdrawal - ${reference}`,
      });

      return {
        transaction: debitTx,
        payout: payoutResult,
        message: payoutResult.status === 'success'
          ? 'Withdrawal initiated. Funds will arrive in your bank shortly.'
          : 'Wallet debited. Payout is being processed.',
      };
    }

    // Default: simple wallet debit (USD or when no bank details provided)
    return this.walletService.debitWallet(
      req.user.id,
      currency,
      amount,
      `with_${Date.now()}`,
      { description: 'Wallet Withdrawal', method: 'Bank Transfer' }
    );
  }

  // ─── Resolve Bank Account ────────────────────────────────
  @Post('resolve-account')
  @UseGuards(JwtAuthGuard)
  async resolveAccount(@Body() body: { bankCode: string; accountNumber: string }) {
    if (!body.bankCode || !body.accountNumber) {
      throw new BadRequestException('Bank code and account number are required');
    }
    return this.fincraService.resolveBankAccount(body.bankCode, body.accountNumber);
  }

  // ─── Currency Conversion ─────────────────────────────────
  @Post('convert')
  @UseGuards(JwtAuthGuard)
  async convert(@Request() req: any, @Body() body: { from: Currency, to: Currency, amount: number }) {
    const { from, to, amount } = body;
    if (!amount || amount <= 0) throw new BadRequestException('Invalid amount');
    if (from === to) throw new BadRequestException('Cannot convert to the same currency');
    return this.walletService.convertCurrency(req.user.id, from, to, amount);
  }

  // ─── Stripe Webhook (Wallet Funding Confirmation) ────────
  @Post('webhook/stripe')
  async handleStripeWebhook(@Req() req: any, @Headers('stripe-signature') sig: string) {
    try {
      const payload = req.rawBody || req.body;
      const event = this.stripeService.constructEvent(payload, sig);

      if (event?.type === 'checkout.session.completed') {
        const session = event.data?.object;
        const userId = session?.metadata?.userId;
        const type = session?.metadata?.type;
        const walletCurrency = session?.metadata?.walletCurrency;

        if (type === 'wallet_fund' && userId) {
          const amountTotal = (session.amount_total || 0) / 100; // Stripe amounts are in cents
          const currency = walletCurrency === 'NGN' ? Currency.NGN : Currency.USD;

          await this.walletService.creditWallet(
            userId,
            currency,
            amountTotal,
            `stripe_${session.id}`,
            { description: 'Wallet Funding via Stripe', method: 'Card Payment', stripeSessionId: session.id }
          );
        }
      }

      return { received: true };
    } catch (err: any) {
      console.error(`Stripe Webhook Error: ${err.message}`);
      return { received: false, error: 'Webhook processing failed' };
    }
  }

  // ─── Fincra Webhook (Payment Confirmation) ───────────────
  @Post('webhook/fincra')
  async handleFincraWebhook(@Body() body: any) {
    try {
      const event = body;

      if (event?.event === 'charge.successful' || event?.event === 'payment.successful') {
        const data = event.data;
        const userId = data?.metadata?.userId;
        const type = data?.metadata?.type;

        if (type === 'wallet_fund' && userId) {
          const amount = data.amount || data.amountReceived || 0;
          const walletCurrency = data?.metadata?.walletCurrency;
          const currency = walletCurrency === 'USD' ? Currency.USD : Currency.NGN;

          await this.walletService.creditWallet(
            userId,
            currency,
            amount,
            `fincra_${data.reference || Date.now()}`,
            { description: 'Wallet Funding via Fincra', method: 'Fincra Payment', fincraRef: data.reference }
          );
        }
      }

      return { received: true };
    } catch (err) {
      return { received: false, error: 'Webhook processing failed' };
    }
  }
}

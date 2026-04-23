import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { FincraService } from '../demo/services/fincra.service';
import { StripeService } from '../demo/services/stripe.service';
import { NdcService } from '../ndc/ndc.service';
import { Tenant } from '../tenant/tenant.entity';
import { WalletService } from '../wallet/wallet.service';
import { UsersService } from '../users/users.service';
import { Currency } from '../wallet/entities/wallet.entity';

@Injectable()
export class CheckoutService {
  private readonly logger = new Logger(CheckoutService.name);

  constructor(
    private readonly fincraService: FincraService,
    private readonly stripeService: StripeService,
    private readonly ndcService: NdcService,
    private readonly walletService: WalletService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Orchestrates the unified booking flow: Wallet/Payment -> Settle -> Book
   */
  async processBooking(tenant: Tenant, bookingDetails: any) {
    const { amount, currency, email, vertical, providerData } = bookingDetails;
    
    this.logger.log(`Checkout: Processing ${vertical} booking for tenant ${tenant.name}`);

    // 1. Try to pay via Internal Wallet first
    try {
      const user = await this.usersService.findByEmail(tenant.email);
      if (user) {
        this.logger.log(`Wallet: Attempting deduction for ${tenant.email}`);
        const tx = await this.walletService.debitWallet(
          user.id,
          currency as Currency,
          amount,
          `pay_${Date.now()}`,
          { vertical, tenant: tenant.name }
        );

        // Wallet deduction successful! Finalize booking immediately.
        const bookingResult = await this.finalizeBooking(tx.reference, vertical, providerData);
        
        return {
          status: 'success',
          message: 'Booking completed successfully using wallet balance',
          transaction: tx,
          bookingResult
        };
      }
    } catch (err) {
      if (err instanceof BadRequestException && err.message.includes('balance')) {
        this.logger.warn(`Wallet: Insufficient funds for ${tenant.email}. Falling back to external payment.`);
      } else {
        this.logger.error(`Wallet Error: ${err.message}`);
        // If it's a real error (not just balance), we might want to fail, 
        // but for now, we fallback to external payment.
      }
    }

    // 2. Fallback: Initiate External Payment based on currency
    let paymentResponse;
    if (currency === 'NGN') {
      paymentResponse = await this.fincraService.createPaymentLink({
        amount,
        currency,
        email,
        reference: `bk_${Date.now()}`,
      });
    } else {
      paymentResponse = await this.stripeService.createPaymentIntent({
        amount,
        currency,
        description: `Travsify ${vertical} booking via ${tenant.name}`,
      });
    }

    return {
      status: 'pending_payment',
      paymentDetails: paymentResponse,
      instruction: 'Complete payment to finalize booking',
    };
  }

  /**
   * Finalizes the booking after payment confirmation
   * This would typically be called by a Webhook handler
   */
  async finalizeBooking(reference: string, vertical: string, providerData: any) {
    this.logger.log(`Settlement: Finalizing ${vertical} booking for reference ${reference}`);

    // 1. Execute the actual booking with the provider
    if (vertical === 'flight') {
       return this.ndcService.orderCreate(providerData);
    }
    
    // 2. Logic to credit Tenant markup would happen here
    // (requires a Wallet/Ledger service integration)
    
    return { status: 'success', message: 'Booking confirmed and settled' };
  }
}

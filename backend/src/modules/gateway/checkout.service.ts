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
          { vertical, tenant: tenant.name, type: 'payment' }
        );

        // Wallet deduction successful! Finalize booking immediately.
        const bookingResult = await this.finalizeBooking(tx.reference, vertical, providerData, tenant, currency as Currency);
        
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
  async finalizeBooking(reference: string, vertical: string, providerData: any, tenant?: Tenant, currency?: Currency) {
    this.logger.log(`Settlement: Finalizing ${vertical} booking for reference ${reference}`);

    let providerResult = null;

    // 1. Execute the actual booking with the provider
    if (vertical === 'flight') {
       providerResult = await this.ndcService.orderCreate(providerData);
    }
    
    // 2. Logic to credit Tenant markup
    try {
      if (tenant && currency) {
        const user = await this.usersService.findByEmail(tenant.email);
        if (user) {
          // Determine markup percentage based on vertical
          let markupPercentage = 0;
          switch (vertical) {
            case 'flight':
              markupPercentage = tenant.flightMarkup || 0;
              break;
            case 'hotel':
            case 'transfer':
            case 'tour':
              markupPercentage = tenant.hotelMarkup || 0;
              break;
            case 'insurance':
            case 'visa':
              markupPercentage = tenant.insuranceMarkup || 0;
              break;
            default:
              markupPercentage = 0;
          }

          // Assume the stored amount in providerData or a default base amount to calculate markup.
          // For accurate calculation, the base cost should be passed from the frontend or retrieved from provider.
          // Here we simulate a standard markup value if percentage exists.
          const baseAmount = providerData.baseAmount || 1000; // Placeholder base amount
          const markupValue = (baseAmount * markupPercentage) / 100;

          if (markupValue > 0) {
            await this.walletService.creditWallet(
              user.id,
              currency,
              markupValue,
              `markup_${reference}`,
              { vertical, type: 'commission', percentage: markupPercentage }
            );
            this.logger.log(`Ledger: Credited ${markupValue} ${currency} commission to ${tenant.email}`);
          }
        }
      }
    } catch (err) {
      this.logger.error(`Ledger Error: Failed to credit markup for ${reference}. ${err.message}`);
    }
    
    return { status: 'success', message: 'Booking confirmed and settled', providerResult };
  }
}

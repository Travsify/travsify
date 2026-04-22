import { Injectable, Logger } from '@nestjs/common';
import { FincraService } from '../demo/services/fincra.service';
import { StripeService } from '../demo/services/stripe.service';
import { NdcService } from '../ndc/ndc.service';
import { Tenant } from '../tenant/tenant.entity';

@Injectable()
export class CheckoutService {
  private readonly logger = new Logger(CheckoutService.name);

  constructor(
    private readonly fincraService: FincraService,
    private readonly stripeService: StripeService,
    private readonly ndcService: NdcService,
  ) {}

  /**
   * Orchestrates the unified booking flow: Payment -> Settle -> Book
   */
  async processBooking(tenant: Tenant, bookingDetails: any) {
    const { amount, currency, email, vertical, providerData } = bookingDetails;
    
    this.logger.log(`Checkout: Processing ${vertical} booking for tenant ${tenant.name}`);

    // 1. Initiate Payment based on currency
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

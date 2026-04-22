import { UnifiedPrice } from '../interfaces/unified-travel.interface';

export class PricingEngine {
  /**
   * Calculates the final price for a tenant's end-user.
   * @param baseAmount The net rate from the provider.
   * @param platformFee Your base commission/fee.
   * @param tenantMarkup The developer's added markup.
   * @param currency The currency code.
   */
  static calculate(
    baseAmount: number,
    platformFee: number,
    tenantMarkup: number,
    currency: string = 'USD'
  ): UnifiedPrice {
    const travsifyTotal = baseAmount + platformFee;
    const finalTotal = travsifyTotal + tenantMarkup;

    return {
      baseAmount,
      travsifyFee: platformFee,
      tenantMarkup: tenantMarkup,
      totalAmount: finalTotal,
      currency,
    };
  }
}

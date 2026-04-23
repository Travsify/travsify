import { UnifiedPrice } from '../interfaces/unified-travel.interface';
import { CurrencyService } from '../services/currency.service';

export class PricingEngine {
  /**
   * Calculates the final price for a tenant's end-user.
   * @param baseAmount The net rate from the provider.
   * @param platformFee Your base commission/fee.
   * @param tenantMarkup The developer's added markup.
   * @param sourceCurrency The currency provided by the API.
   * @param targetCurrency The currency requested by the user/tenant.
   * @param currencyService Instance of CurrencyService.
   */
  static calculate(
    baseAmount: number,
    platformFee: number,
    tenantMarkup: number,
    sourceCurrency: string,
    targetCurrency: string,
    currencyService: CurrencyService
  ): UnifiedPrice {
    // 1. Convert everything to the target currency
    const convertedBase = currencyService.convert(baseAmount, sourceCurrency, targetCurrency);
    const convertedPlatformFee = currencyService.convert(platformFee, sourceCurrency, targetCurrency);
    const convertedTenantMarkup = currencyService.convert(tenantMarkup, sourceCurrency, targetCurrency);

    const totalAmount = convertedBase + convertedPlatformFee + convertedTenantMarkup;

    return {
      baseAmount: convertedBase,
      travsifyFee: convertedPlatformFee,
      tenantMarkup: convertedTenantMarkup,
      totalAmount: totalAmount,
      currency: targetCurrency,
    };
  }
}

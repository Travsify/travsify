import { Injectable } from '@nestjs/common';

@Injectable()
export class CurrencyService {
  // Static rates for demonstration, can be updated from an external API in production
  private rates: Record<string, number> = {
    USD: 1,
    NGN: 1550, // Updated to a more recent market average
    EUR: 0.92,
    GBP: 0.79,
  };

  /**
   * Converts an amount from one currency to another
   */
  convert(amount: number, from: string, to: string): number {
    const fromRate = this.rates[from.toUpperCase()] || 1;
    const toRate = this.rates[to.toUpperCase()] || 1;
    
    // Convert to USD base first
    const inUsd = amount / fromRate;
    
    // Convert to target
    return Math.round((inUsd * toRate) * 100) / 100;
  }

  getRates() {
    return this.rates;
  }
}

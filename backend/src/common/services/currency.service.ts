import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CurrencyService {
  private readonly logger = new Logger(CurrencyService.name);
  private rates: Record<string, number> = {
    USD: 1,
    NGN: 1550,
    EUR: 0.92,
    GBP: 0.79,
  };
  private lastFetched: number = 0;
  private readonly CACHE_DURATION = 1000 * 60 * 60; // 1 hour cache

  constructor(private configService: ConfigService) {
    this.fetchLiveRates(); // Warm up on startup
  }

  /**
   * Fetches live exchange rates from a free public API.
   * Falls back to hardcoded rates if the fetch fails.
   */
  private async fetchLiveRates() {
    try {
      const response = await fetch('https://open.er-api.com/v6/latest/USD');
      if (response.ok) {
        const data = await response.json();
        if (data?.result === 'success' && data?.rates) {
          this.rates = {
            USD: 1,
            NGN: data.rates.NGN || 1550,
            EUR: data.rates.EUR || 0.92,
            GBP: data.rates.GBP || 0.79,
            CAD: data.rates.CAD || 1.37,
            ZAR: data.rates.ZAR || 18.2,
            KES: data.rates.KES || 129,
            GHS: data.rates.GHS || 15.5,
          };
          this.lastFetched = Date.now();
          this.logger.log(`Currency rates updated: 1 USD = ${this.rates.NGN} NGN`);
        }
      }
    } catch (err) {
      this.logger.warn(`Failed to fetch live rates, using fallback: ${err.message}`);
    }
  }

  /**
   * Converts an amount from one currency to another.
   * Automatically refreshes rates if cache is stale.
   */
  convert(amount: number, from: string, to: string): number {
    // Refresh rates if stale
    if (Date.now() - this.lastFetched > this.CACHE_DURATION) {
      this.fetchLiveRates();
    }

    if (from.toUpperCase() === to.toUpperCase()) return Math.round(amount * 100) / 100;

    const fromRate = this.rates[from.toUpperCase()] || 1;
    const toRate = this.rates[to.toUpperCase()] || 1;
    
    // Convert to USD base first, then to target
    const inUsd = amount / fromRate;
    return Math.round((inUsd * toRate) * 100) / 100;
  }

  getRates() {
    return { ...this.rates };
  }
}

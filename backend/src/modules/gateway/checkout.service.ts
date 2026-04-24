import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { FincraService } from '../demo/services/fincra.service';
import { StripeService } from '../demo/services/stripe.service';
import { NdcService } from '../ndc/ndc.service';
import { Tenant } from '../tenant/tenant.entity';
import { WalletService } from '../wallet/wallet.service';
import { UsersService } from '../users/users.service';
import { Currency } from '../wallet/entities/wallet.entity';
import { LiteApiService } from '../demo/services/liteapi.service';
import { MozioService } from '../demo/services/mozio.service';
import { GetYourGuideService } from '../demo/services/getyourguide.service';
import { SafetyWingService } from '../demo/services/safetywing.service';
import { SherpaService } from '../demo/services/sherpa.service';
import { NotificationService } from '../notifications/notification.service';
import { BookingsService } from '../bookings/bookings.service';
import { BookingStatus } from '../bookings/entities/booking.entity';

@Injectable()
export class CheckoutService {
  private readonly logger = new Logger(CheckoutService.name);

  constructor(
    private readonly fincraService: FincraService,
    private readonly stripeService: StripeService,
    private readonly ndcService: NdcService,
    private readonly walletService: WalletService,
    private readonly usersService: UsersService,
    private readonly liteApiService: LiteApiService,
    private readonly mozioService: MozioService,
    private readonly gygService: GetYourGuideService,
    private readonly safetyWingService: SafetyWingService,
    private readonly sherpaService: SherpaService,
    private readonly notificationService: NotificationService,
    private readonly bookingsService: BookingsService,
  ) {}

  /**
   * Orchestrates the unified booking flow: Wallet/Payment -> Settle -> Book
   */
  async processBooking(tenant: Tenant, bookingDetails: any) {
    const { amount, currency, email, vertical, providerData, itemName, itemId } = bookingDetails;
    
    this.logger.log(`Checkout: Processing ${vertical} booking for tenant ${tenant.name}`);

    // 1. Pay via Internal Wallet
    try {
      const user = await this.usersService.findByEmail(tenant.email);
      if (!user) throw new NotFoundException('User not found');

      // Create Managed Booking Record via BookingsService (Unified)
      const booking = await this.bookingsService.createManagedBooking(user.id, {
        vertical,
        provider: bookingDetails.provider || 'Verified Network',
        itemId: itemId || 'REF_' + Date.now(),
        itemName: itemName || vertical + ' Service',
        pax: providerData?.pax || providerData || {},
        amount,
        currency,
        paymentMethod: 'wallet'
      });

      // Wallet deduction and record update already handled by bookingsService.createManagedBooking
      // We just need to finalize the provider call if it's an automated vertical.
      const bookingResult = await this.finalizeBooking(booking.id, vertical, providerData, tenant, currency as Currency);
      
      return {
        status: 'success',
        message: 'Booking captured and processed',
        booking,
        bookingResult
      };
    } catch (err) {
      if (err instanceof BadRequestException && err.message.includes('balance')) {
        throw new BadRequestException({
          code: 'INSUFFICIENT_FUNDS',
          message: 'Insufficient wallet balance. Please fund your account to complete this booking.',
          currency
        });
      }
      throw err;
    }
  }

  /**
   * Finalizes the booking after payment confirmation
   * This would typically be called by a Webhook handler
   */
  async finalizeBooking(reference: string, vertical: string, providerData: any, tenant?: Tenant, currency?: Currency) {
    this.logger.log(`Settlement: Finalizing ${vertical} booking for reference ${reference}`);

    let providerResult = null;

    // 1. Execute the actual booking with the provider
    try {
      if (vertical === 'flight') {
         providerResult = await this.ndcService.orderCreate(providerData);
      } else if (vertical === 'hotel') {
         providerResult = await this.liteApiService.bookHotel(providerData);
      } else if (vertical === 'transfer') {
         providerResult = await this.mozioService.bookRide(providerData);
      } else if (vertical === 'tour') {
         providerResult = await this.gygService['bookTour'] ? await (this.gygService as any).bookTour(providerData) : { status: 'mocked', vertical };
      } else if (vertical === 'insurance') {
         providerResult = await this.safetyWingService['bookInsurance'] ? await (this.safetyWingService as any).bookInsurance(providerData) : { status: 'mocked', vertical };
      } else if (vertical === 'visa') {
         providerResult = await this.sherpaService.bookVisa(providerData);
      }
    } catch (err) {
      this.logger.error(`Provider Error: ${err.message}`);
      await this.bookingsService.updateStatus(reference, BookingStatus.FAILED);
      
      const user = await this.usersService.findByEmail(tenant?.email);
      if (user) {
        await this.notificationService.create({
          userId: user.id,
          title: 'Booking Failed',
          message: `Your ${vertical} booking attempt failed. Please check your transaction history for details.`,
          type: 'error'
        });
      }
      throw err;
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
    // 3. Update Booking Record Status
    try {
      const status = (vertical === 'flight' || vertical === 'hotel') ? BookingStatus.CONFIRMED : BookingStatus.FULFILLED;
      await this.bookingsService.updateStatus(reference, status, { pnr: providerResult?.pnr || providerResult?.bookingReference || '' });
    } catch (err) {
      this.logger.error(`Status Update Error: Failed to update status for ${reference}. ${err.message}`);
    }

    // 4. Create Notification
    try {
      const user = await this.usersService.findByEmail(tenant?.email);
      if (user) {
        await this.notificationService.create({
          userId: user.id,
          title: 'Booking Confirmed',
          message: `Your ${vertical} booking (${reference.substring(0, 8)}) has been successfully processed and settled.`,
          type: 'success',
          actionUrl: '/dashboard/bookings'
        });
      }
    } catch (err) {
      this.logger.error(`Notification Error: ${err.message}`);
    }
    
    return { status: 'success', message: 'Booking confirmed and settled', providerResult };
  }
}

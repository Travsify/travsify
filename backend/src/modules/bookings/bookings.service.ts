import { Injectable, InternalServerErrorException, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import { NdcService } from '../ndc/ndc.service';
import { WalletService } from '../wallet/wallet.service';
import { Currency } from '../wallet/entities/wallet.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private ndcService: NdcService,
    private walletService: WalletService,
    private dataSource: DataSource,
  ) {}

  /**
   * Orchestrates the full XML.AGENCY booking flow with Markup and Auto-Refunds
   */
  async createBooking(userId: string, bookingData: {
    offerCode: string,
    searchGuid: string,
    passengers: any[],
    contact: any,
    currency: string
  }): Promise<Booking> {

    // 1. Fetch User and their Markup settings
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('User not found');

    // 2. Pre-book: Reconfirm provider price
    this.logger.log(`Pre-booking for user ${userId}, offer: ${bookingData.offerCode}`);
    const prebookResponse = await this.ndcService.offerPrice(bookingData.offerCode, bookingData.searchGuid);
    const providerPrice = parseFloat(prebookResponse.FullPrice);

    if (isNaN(providerPrice)) {
      throw new BadRequestException('Could not determine price from provider');
    }

    // 3. Apply Markup Logic (Percentage + Flat Fee)
    const markupAmount = (providerPrice * (Number(user.markupPercent) / 100)) + Number(user.markupFlat);
    const userTotalPrice = providerPrice + markupAmount;

    this.logger.log(`Price Breakdown: Provider=${providerPrice}, Markup=${markupAmount.toFixed(2)}, UserTotal=${userTotalPrice.toFixed(2)}`);

    // Resolve the Currency enum from the string
    const walletCurrency = bookingData.currency.toUpperCase() === 'NGN' ? Currency.NGN : Currency.USD;
    let bookingId: string | undefined;

    try {
      // 4. Debit User Wallet (Total Price including Markup)
      await this.walletService.debitWallet(
        userId,
        walletCurrency,
        userTotalPrice,
        `Flight Booking: ${bookingData.offerCode}`,
      );

      // 5. Create Initial Booking Record
      const booking = this.bookingRepository.create({
        userId,
        totalPrice: userTotalPrice,
        currency: bookingData.currency,
        status: BookingStatus.PENDING,
        passengerDetails: bookingData.passengers,
        flightDetails: prebookResponse.Offers || null,
      });
      const savedBooking = await this.bookingRepository.save(booking) as Booking;
      bookingId = savedBooking.id;

      // 6. AeroBook: Make reservation with provider
      let bookResponse: any;
      try {
        bookResponse = await this.ndcService.orderCreate({
          offerCode: bookingData.offerCode,
          searchGuid: bookingData.searchGuid,
          passengers: bookingData.passengers,
          contact: bookingData.contact,
        });
      } catch (bookError: any) {
        this.logger.error(`AeroBook failed: ${bookError.message}`);
        throw new Error(`Reservation failed: ${bookError.message}`);
      }

      // Update with PNR and Provider IDs
      savedBooking.pnr = bookResponse?.Offers?.OfferInfo?.PNR || '';
      savedBooking.providerBookId = bookResponse.BookId;
      savedBooking.providerBookGuid = bookResponse.BookGuid;
      savedBooking.status = BookingStatus.BOOKED;
      await this.bookingRepository.save(savedBooking);

      // 7. ConfirmBook: Final Ticketing
      let confirmResponse: any;
      try {
        confirmResponse = await this.ndcService.orderChange({
          bookId: bookResponse.BookId,
          bookGuid: bookResponse.BookGuid,
          price: providerPrice, // We pay the provider their original price
        });
      } catch (confirmError: any) {
        this.logger.error(`ConfirmBook failed: ${confirmError.message}`);
        throw new Error(`Ticketing failed: ${confirmError.message}`);
      }

      // 8. Finalize Success
      const ticketNumber = this.extractTicketNumber(confirmResponse);
      savedBooking.ticketNumber = ticketNumber;
      savedBooking.status = BookingStatus.TICKETED;
      await this.bookingRepository.save(savedBooking);

      this.logger.log(`Booking ${bookingId} successful. PNR: ${savedBooking.pnr}`);
      return savedBooking;

    } catch (error: any) {
      // 9. AUTOMATED REFUND LOGIC
      this.logger.error(`Booking failed for user ${userId}. Triggering auto-refund. Error: ${error.message}`);

      try {
        await this.walletService.creditWallet(
          userId,
          walletCurrency,
          userTotalPrice,
          `Auto-Refund: Booking Failed (${error.message})`,
        );

        // Mark the booking as FAILED if it was created
        if (bookingId) {
          await this.bookingRepository.update(bookingId, { status: BookingStatus.FAILED });
        }
      } catch (refundError: any) {
        this.logger.error(`CRITICAL: Auto-refund failed for user ${userId}! Manual intervention required. Error: ${refundError.message}`);
      }

      throw new InternalServerErrorException(error.message || 'Booking process failed');
    }
  }

  private extractTicketNumber(response: any): string {
    try {
      const info = response.OrderInfoData || response;
      const passengers = info?.MultiGatesInfo?.OfferInfo?.Passengers?.OfferPassenger;
      const paxList = Array.isArray(passengers) ? passengers : [passengers];
      return paxList.map((p: any) => p.TicketNumber).filter(Boolean).join(', ');
    } catch (e) {
      return 'TICKET_PENDING';
    }
  }

  async createManagedBooking(userId: string, data: {
    vertical: string,
    provider: string,
    itemId: string,
    itemName: string,
    pax: any,
    amount: number,
    currency: string,
    paymentMethod: string
  }): Promise<Booking> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('User not found');

    const walletCurrency = data.currency.toUpperCase() === 'NGN' ? Currency.NGN : Currency.USD;

    try {
      // 1. Debit Wallet
      await this.walletService.debitWallet(
        userId,
        walletCurrency,
        data.amount,
        `Managed Booking Payment: ${data.itemName} (${data.vertical})`,
      );

      // 2. Create Managed Booking Record
      const booking = this.bookingRepository.create({
        userId,
        totalPrice: data.amount,
        currency: data.currency,
        vertical: data.vertical,
        status: BookingStatus.FULFILLMENT_PENDING,
        fulfillmentType: 'manual',
        passengerDetails: data.pax,
        flightDetails: { 
          itemName: data.itemName, 
          provider: data.provider, 
          itemId: data.itemId,
          paxDetails: data.pax
        },
      });

      return await this.bookingRepository.save(booking);

    } catch (error: any) {
      this.logger.error(`Managed booking failed: ${error.message}`);
      throw new InternalServerErrorException(error.message || 'Payment processing failed');
    }
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    return this.bookingRepository.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }
}

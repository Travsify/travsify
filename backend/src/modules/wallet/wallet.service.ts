import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { Wallet, Currency } from './entities/wallet.entity';
import { Transaction, TransactionType, TransactionStatus } from './entities/transaction.entity';

import { CurrencyService } from '../../common/services/currency.service';
import { NotificationService } from '../notifications/notification.service';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private dataSource: DataSource,
    private currencyService: CurrencyService,
    private notificationService: NotificationService,
  ) {}

  async findUserWallets(userId: string): Promise<Wallet[]> {
    let wallets = await this.walletRepository.find({ where: { userId } });
    
    // Auto-create wallets if they don't exist
    if (wallets.length === 0) {
      const ngnWallet = this.walletRepository.create({ userId, currency: Currency.NGN, balance: 0 });
      const usdWallet = this.walletRepository.create({ userId, currency: Currency.USD, balance: 0 });
      wallets = await this.walletRepository.save([ngnWallet, usdWallet]);
    }
    
    return wallets;
  }

  async findUserWallet(userId: string, currency: Currency): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({ where: { userId, currency } });
    if (!wallet) {
      return this.walletRepository.save(this.walletRepository.create({ userId, currency, balance: 0 }));
    }
    return wallet;
  }

  async creditWallet(userId: string, currency: Currency, amount: number, reference: string, metadata?: any): Promise<Transaction> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const wallet = await queryRunner.manager.findOne(Wallet, { where: { userId, currency }, lock: { mode: 'pessimistic_write' } });
      if (!wallet) throw new NotFoundException('Wallet not found');

      wallet.balance = Number(wallet.balance) + Number(amount);
      await queryRunner.manager.save(wallet);

      const transaction = queryRunner.manager.create(Transaction, {
        walletId: wallet.id,
        amount,
        type: TransactionType.CREDIT,
        status: TransactionStatus.SUCCESS,
        reference,
        metadata,
      });

      const savedTransaction = await queryRunner.manager.save(transaction);
      await queryRunner.commitTransaction();

      // Send notification
      await this.notificationService.create({
        userId,
        title: 'Wallet Credited',
        message: `Your wallet has been credited with ${amount} ${currency}.`,
        type: 'wallet_credit'
      });

      return savedTransaction;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async debitWallet(userId: string, currency: Currency, amount: number, reference: string, metadata?: any): Promise<Transaction> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const wallet = await queryRunner.manager.findOne(Wallet, { where: { userId, currency }, lock: { mode: 'pessimistic_write' } });
      if (!wallet) throw new NotFoundException('Wallet not found');

      if (Number(wallet.balance) < Number(amount)) {
        throw new BadRequestException('Insufficient wallet balance');
      }

      wallet.balance = Number(wallet.balance) - Number(amount);
      await queryRunner.manager.save(wallet);

      const transaction = queryRunner.manager.create(Transaction, {
        walletId: wallet.id,
        amount,
        type: TransactionType.DEBIT,
        status: TransactionStatus.SUCCESS,
        reference,
        metadata,
      });

      const savedTransaction = await queryRunner.manager.save(transaction);
      await queryRunner.commitTransaction();

      // Send notification
      await this.notificationService.create({
        userId,
        title: 'Wallet Debited',
        message: `Your wallet was debited ${amount} ${currency}.`,
        type: 'wallet_debit'
      });

      return savedTransaction;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async convertCurrency(userId: string, from: Currency, to: Currency, amount: number): Promise<{ fromTransaction: Transaction, toTransaction: Transaction }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Check balances
      const fromWallet = await queryRunner.manager.findOne(Wallet, { where: { userId, currency: from }, lock: { mode: 'pessimistic_write' } });
      const toWallet = await queryRunner.manager.findOne(Wallet, { where: { userId, currency: to }, lock: { mode: 'pessimistic_write' } });

      if (!fromWallet || !toWallet) throw new NotFoundException('Wallet not found');
      if (Number(fromWallet.balance) < Number(amount)) throw new BadRequestException('Insufficient balance for conversion');

      // 2. Calculate conversion
      const convertedAmount = this.currencyService.convert(amount, from, to);
      const rate = convertedAmount / amount;

      // 3. Update balances
      fromWallet.balance = Number(fromWallet.balance) - Number(amount);
      toWallet.balance = Number(toWallet.balance) + Number(convertedAmount);

      await queryRunner.manager.save(fromWallet);
      await queryRunner.manager.save(toWallet);

      // 4. Record transactions
      const ref = `conv_${Date.now()}`;
      const fromTx = queryRunner.manager.create(Transaction, {
        walletId: fromWallet.id,
        amount,
        type: TransactionType.DEBIT,
        status: TransactionStatus.SUCCESS,
        reference: ref,
        metadata: { type: 'conversion', to: to, rate }
      });

      const toTx = queryRunner.manager.create(Transaction, {
        walletId: toWallet.id,
        amount: convertedAmount,
        type: TransactionType.CREDIT,
        status: TransactionStatus.SUCCESS,
        reference: ref,
        metadata: { type: 'conversion', from: from, rate }
      });

      const [savedFrom, savedTo] = await Promise.all([
        queryRunner.manager.save(fromTx),
        queryRunner.manager.save(toTx)
      ]);

      await queryRunner.commitTransaction();

      // Send notification
      await this.notificationService.create({
        userId,
        title: 'Currency Converted',
        message: `You successfully converted ${amount} ${from} to ${convertedAmount.toFixed(2)} ${to}.`,
        type: 'wallet_conversion'
      });

      return { fromTransaction: savedFrom, toTransaction: savedTo };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findUserTransactions(userId: string): Promise<Transaction[]> {
    const wallets = await this.walletRepository.find({ where: { userId } });
    const walletIds = wallets.map(w => w.id);
    
    if (walletIds.length === 0) return [];

    return this.transactionRepository.find({
      where: { walletId: In(walletIds) },
      order: { createdAt: 'DESC' },
      relations: ['wallet']
    });
  }

  async getRevenueStats(userId: string, period: 'daily' | 'weekly' | 'monthly' = 'daily'): Promise<any[]> {
    const wallets = await this.walletRepository.find({ where: { userId } });
    const walletIds = wallets.map(w => w.id);
    if (walletIds.length === 0) return [];

    const transactions = await this.transactionRepository.find({
      where: { 
        walletId: In(walletIds),
        type: TransactionType.CREDIT,
        status: TransactionStatus.SUCCESS
      },
      order: { createdAt: 'ASC' }
    });

    const stats: Record<string, number> = {};
    
    transactions.forEach(tx => {
      const date = new Date(tx.createdAt);
      let key = '';
      
      if (period === 'daily') {
        key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else if (period === 'weekly') {
        const firstDay = new Date(date.setDate(date.getDate() - date.getDay()));
        key = `Week of ${firstDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      } else {
        key = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      }

      stats[key] = (stats[key] || 0) + Number(tx.amount);
    });

    return Object.entries(stats).map(([date, amount]) => ({ date, amount }));
  }
}

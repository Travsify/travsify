import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { Wallet, Currency } from './entities/wallet.entity';
import { Transaction, TransactionType, TransactionStatus } from './entities/transaction.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private dataSource: DataSource,
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
      return savedTransaction;
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
}

import { Injectable } from '@nestjs/common';
import { Transaction } from 'src/domain/entities/transaction.entity';
import { ITransactionRepository } from 'src/domain/repositories/transaction.repository';

@Injectable()
export class TransactionRepositoryImpl implements ITransactionRepository {
  private readonly transactions: Transaction[] = [];

  create(transaction: Transaction): Promise<void> {
    this.transactions.push(transaction);
    return Promise.resolve();
  }

  list(): Promise<Transaction[]> {
    return Promise.resolve([...this.transactions]);
  }

  deleteAll(): Promise<void> {
    this.transactions.length = 0;
    return Promise.resolve();
  }
}

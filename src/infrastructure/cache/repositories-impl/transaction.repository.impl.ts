import { Injectable } from '@nestjs/common';
import { Transaction } from 'src/domain/entities/transaction.entity';
import { ITransactionRepository } from 'src/domain/repositories/transaction.repository';

@Injectable()
export class TransactionRepositoryImpl implements ITransactionRepository {
  private readonly transactions: Transaction[] = [];

  create(transaction: Transaction): void {
    this.transactions.push(transaction);
  }

  listFrom(date: Date): Transaction[] {
    return this.transactions.filter((tx) => tx.timestamp >= date);
  }

  deleteAll(): void {
    this.transactions.length = 0;
  }
}

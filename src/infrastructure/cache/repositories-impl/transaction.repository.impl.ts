import { Injectable } from '@nestjs/common';
import { Transaction } from 'src/domain/entities/transaction.entity';
import { ITransactionRepository } from 'src/domain/repositories/transaction.repository';

@Injectable()
export class TransactionRepositoryImpl implements ITransactionRepository {
  private readonly transactions: Transaction[] = [];

  async create(transaction: Transaction): Promise<void> {
    this.transactions.push(transaction);
    console.log(this.transactions)
  }

  async list(): Promise<Transaction[]> {
    return [...this.transactions];
  }

  async deleteAll(): Promise<void> {
    this.transactions.length = 0;
  }
}

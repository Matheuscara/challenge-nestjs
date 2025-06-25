import { Injectable } from '@nestjs/common';
import { Transaction } from 'src/domain/entities/transaction.entity';
import { ITransactionRepository } from 'src/domain/repositories/repository.repository';

@Injectable()
export class TransactionRepositoryImpl implements ITransactionRepository {
  private readonly transactions: Transaction[] = [];

  async create(transaction: Transaction): Promise<void> {
    this.transactions.push(transaction);
  }

  async list(): Promise<Transaction[]> {
    return [...this.transactions];
  }

  async deleteAll(): Promise<void> {
    this.transactions.length = 0;
  }
}

import { Transaction } from '../entities/transaction.entity';

export interface ITransactionRepository {
  create(transaction: Omit<Transaction, 'id'>): void;
  listFrom(date: Date): Transaction[];
  deleteAll(): void;
}

export const ITransactionRepository = Symbol('ITransactionRepository');

import { Transaction } from '../entities/transaction.entity';

export interface ITransactionRepository {
  create(transaction: Omit<Transaction, 'id'>): Promise<void>;
  list(): Promise<Transaction[]>;
  deleteAll(): Promise<void>;
}

export const ITransactionRepository = Symbol('ITransactionRepository');

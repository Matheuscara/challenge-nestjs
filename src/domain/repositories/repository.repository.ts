import { Transaction } from '../entities/transaction.entity';

export interface ITransactionRepository {
  create(transaction: Transaction): Promise<void>;
  list(): Promise<Transaction[]>
  deleteAll(): Promise<void>;
}

export const ITransactionRepository = Symbol('ITransactionRepository');

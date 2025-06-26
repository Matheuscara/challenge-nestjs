import { Transaction } from '../entities/transaction.entity';
import { TransactionStatisticsVO } from './transaction-statistics.vo';

describe('TransactionStatisticsVO', () => {
  it('should return zeros for an empty array', () => {
    const stats = TransactionStatisticsVO.create([]);
    expect(stats.count).toBe(0);
    expect(stats.sum).toBe(0);
    expect(stats.avg).toBe(0);
    expect(stats.min).toBe(0);
    expect(stats.max).toBe(0);
  });

  it('should calculate statistics for a single transaction', () => {
    const tx = { amount: 42 } as Transaction;
    const stats = TransactionStatisticsVO.create([tx]);
    expect(stats.count).toBe(1);
    expect(stats.sum).toBe(42);
    expect(stats.avg).toBe(42);
    expect(stats.min).toBe(42);
    expect(stats.max).toBe(42);
  });

  it('should calculate statistics for multiple transactions', () => {
    const txs: Transaction[] = [
      { amount: 10 } as Transaction,
      { amount: 20 } as Transaction,
      { amount: 30 } as Transaction,
    ];
    const stats = TransactionStatisticsVO.create(txs);
    expect(stats.count).toBe(3);
    expect(stats.sum).toBe(60);
    expect(stats.avg).toBe(20);
    expect(stats.min).toBe(10);
    expect(stats.max).toBe(30);
  });

  it('should calculate a fractional average correctly', () => {
    const txs: Transaction[] = [
      { amount: 1 } as Transaction,
      { amount: 2 } as Transaction,
      { amount: 4 } as Transaction,
    ];
    const stats = TransactionStatisticsVO.create(txs);
    expect(stats.count).toBe(3);
    expect(stats.sum).toBe(7);
    expect(stats.avg).toBeCloseTo(7 / 3);
    expect(stats.min).toBe(1);
    expect(stats.max).toBe(4);
  });

  it('should throw if the sum is negative', () => {
    const txs: Transaction[] = [
      { amount: -5 } as Transaction,
      { amount: 3 } as Transaction,
    ];
    expect(() => TransactionStatisticsVO.create(txs)).toThrowError(
      'Sum cannot be negative.',
    );
  });
});

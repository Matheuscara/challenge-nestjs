import { Transaction } from 'src/domain/entities/transaction.entity';
import { TransactionRepositoryImpl } from './transaction.repository.impl';

describe('TransactionRepositoryImpl', () => {
  let repo: TransactionRepositoryImpl;
  const now = new Date();
  const past = new Date(now.getTime() - 1000 * 60 * 60);
  const future = new Date(now.getTime() + 1000 * 60 * 60);

  beforeEach(() => {
    repo = new TransactionRepositoryImpl();
  });

  it('should start empty', () => {
    expect(repo.listFrom(new Date(0))).toEqual([]);
  });

  it('should create and list transactions', () => {
    const tx1 = { timestamp: past, amount: 10 } as Transaction;
    const tx2 = { timestamp: now, amount: 20 } as Transaction;
    const tx3 = { timestamp: future, amount: 30 } as Transaction;

    repo.create(tx1);
    repo.create(tx2);
    repo.create(tx3);

    expect(repo.listFrom(new Date(0))).toEqual([tx1, tx2, tx3]);

    expect(repo.listFrom(now)).toEqual([tx2, tx3]);

    expect(repo.listFrom(future)).toEqual([tx3]);
  });

  it('should delete all transactions', () => {
    const tx = { timestamp: now, amount: 50 } as Transaction;
    repo.create(tx);
    expect(repo.listFrom(new Date(0))).toHaveLength(1);

    repo.deleteAll();
    expect(repo.listFrom(new Date(0))).toEqual([]);
  });
});

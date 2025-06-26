import { Transaction } from '../entities/transaction.entity';

export class TransactionStatisticsVO {
  private _count: number;
  private _sum: number;
  private _avg: number;
  private _min: number;
  private _max: number;

  private constructor(props: {
    count: number;
    sum: number;
    avg: number;
    min: number;
    max: number;
  }) {
    this._count = props.count;
    this._sum = props.sum;
    this._avg = props.avg;
    this._min = props.min;
    this._max = props.max;

    this.validate();
  }

  public static create(transactions: Transaction[]): TransactionStatisticsVO {
    if (transactions.length === 0) {
      return new TransactionStatisticsVO({
        count: 0,
        sum: 0,
        avg: 0,
        min: 0,
        max: 0,
      });
    }

    const values = transactions.map((tx) => tx.amount);
    const sum = values.reduce((acc, v) => acc + v, 0);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = sum / values.length;

    return new TransactionStatisticsVO({
      count: values.length,
      sum,
      avg,
      min,
      max,
    });
  }

  private validate(): void {
    if (this._count < 0) {
      throw new Error('Count cannot be negative.');
    }
    if (this._sum < 0) {
      throw new Error('Sum cannot be negative.');
    }
    if (this._count === 0) {
      if (this._avg !== 0 || this._min !== 0 || this._max !== 0) {
        throw new Error('For count = 0, avg, min and max must be zero.');
      }
    } else {
      if (this._min > this._max) {
        throw new Error('Min cannot be greater than max.');
      }
      if (this._avg < this._min || this._avg > this._max) {
        throw new Error('Avg must be between min and max.');
      }
    }
  }

  get count(): number {
    return this._count;
  }

  get sum(): number {
    return this._sum;
  }

  get avg(): number {
    return this._avg;
  }

  get min(): number {
    return this._min;
  }

  get max(): number {
    return this._max;
  }
}

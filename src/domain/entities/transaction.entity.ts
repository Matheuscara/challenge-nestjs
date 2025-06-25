import { randomUUID } from 'crypto';
import { DomainError } from '../errors/domain-error';
import { isUUID } from 'class-validator';

export class Transaction {
  private _id: string;
  private _amount: number;
  private _timestamp: Date;

  private constructor(props: { id: string; amount: number; timestamp: Date }) {
    this._id = props.id;
    this._amount = props.amount;
    this._timestamp = props.timestamp;

    this.validate();
  }

  public static create(props: {
    id?: string;
    amount: number;
    timestamp: Date;
  }): Transaction {
    return new Transaction({
      id: props?.id || randomUUID(),
      amount: props.amount,
      timestamp: props.timestamp,
    });
  }

  private validate(): void {
    if (!isUUID(this._id)) {
      throw new DomainError('Invalid transaction ID. Must be a valid UUID.');
    }

    if (
      !(this._timestamp instanceof Date) ||
      isNaN(this._timestamp.getTime())
    ) {
      throw new DomainError('Invalid timestamp. Must be a valid Date object.');
    }

    if (this._timestamp.getTime() > Date.now()) {
      throw new DomainError('Invalid timestamp. Cannot be in the future.');
    }

    if (this._amount < 0) {
      throw new DomainError('Invalid amount. Amount cannot be negative.');
    }
  }

  get id(): string {
    return this._id;
  }

  get amount(): number {
    return this._amount;
  }

  get timestamp(): Date {
    return this._timestamp;
  }
}

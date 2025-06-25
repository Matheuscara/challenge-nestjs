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
    id: string;
    amount: number;
    timestamp: Date;
  }): Transaction {
    return new Transaction({
      id: props.id,
      amount: props.amount,
      timestamp: props.timestamp,
    });
  }

  private validate(): void {
    if (!this._id) {
      throw new Error('Invalid transaction ID. Must be a UUID.');
    }
    if (this._amount < 0) {
      throw new Error('Transaction amount cannot be negative.');
    }
    const now = new Date();
    if (this._timestamp.getTime() > now.getTime()) {
      throw new Error('Transaction timestamp cannot be in the future.');
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

import { Injectable, Inject } from '@nestjs/common';
import { Transaction } from '../../domain/entities/transaction.entity';
import { CreateTransactionDto } from './create-transaction.dto';
import { ITransactionRepository } from '../../domain/repositories/transaction.repository';

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    @Inject(ITransactionRepository)
    private readonly repository: ITransactionRepository,
  ) {}

  execute(input: CreateTransactionDto): void {
    const transaction = Transaction.create({
      amount: input.amount,
      timestamp: input.timestamp,
    });

    this.repository.create(transaction);
  }
}

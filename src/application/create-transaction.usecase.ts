import {
  Injectable,
  Inject,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Transaction } from '../domain/entities/transaction.entity';
import { ITransactionRepository } from '../domain/repositories/transaction.repository';
import { CreateTransactionDto } from './create-transaction.dto';
import { DomainError } from '../domain/errors/domain-error';

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    @Inject(ITransactionRepository)
    private readonly repository: ITransactionRepository,
  ) {}

  async execute(input: CreateTransactionDto): Promise<void> {
    try {
      const transaction = Transaction.create({
        amount: input.amount,
        timestamp: input.timestamp,
      });

      await this.repository.create(transaction);
    } catch (error) {
      if (error instanceof DomainError) {
        throw new UnprocessableEntityException();
      }
    }
  }
}

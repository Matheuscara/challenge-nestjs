import { Injectable, Inject } from '@nestjs/common';
import { ITransactionRepository } from '../domain/repositories/transaction.repository';

@Injectable()
export class DeleteAllTransactionsUseCase {
  constructor(
    @Inject(ITransactionRepository)
    private readonly repository: ITransactionRepository,
  ) {}

  async execute(): Promise<void> {
    await this.repository.deleteAll();
  }
}

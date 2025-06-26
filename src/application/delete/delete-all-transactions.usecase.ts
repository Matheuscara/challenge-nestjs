import { Injectable, Inject } from '@nestjs/common';
import { ITransactionRepository } from '../../domain/repositories/transaction.repository';

@Injectable()
export class DeleteAllTransactionsUseCase {
  constructor(
    @Inject(ITransactionRepository)
    private readonly repository: ITransactionRepository,
  ) {}

  execute(): void {
    this.repository.deleteAll();
  }
}

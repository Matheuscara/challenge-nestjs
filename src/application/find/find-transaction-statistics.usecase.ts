import { Injectable, Inject } from '@nestjs/common';
import { ITransactionRepository } from '../../domain/repositories/transaction.repository';
import { TransactionStatisticsVO } from '../../domain/value-objects/transaction-statistics.vo';
import { FindTransactionStatisticsDto } from './find-transaction-statistics.dto';

@Injectable()
export class FindTransactionStatisticsUseCase {
  constructor(
    @Inject(ITransactionRepository)
    private readonly repository: ITransactionRepository,
  ) {}

  execute(): FindTransactionStatisticsDto {
    const since = new Date();
    since.setSeconds(since.getSeconds() - 60);
    const transactions = this.repository.listFrom(since);
    const statistics = TransactionStatisticsVO.create(transactions);

    return FindTransactionStatisticsDto.fromVO(statistics);
  }
}

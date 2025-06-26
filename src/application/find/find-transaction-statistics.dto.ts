import { TransactionStatisticsVO } from 'src/domain/value-objects/transaction-statistics.vo';

export class FindTransactionStatisticsDto {
  count: number;
  sum: number;
  avg: number;
  min: number;
  max: number;

  static fromVO(entity: TransactionStatisticsVO): FindTransactionStatisticsDto {
    const dto = new FindTransactionStatisticsDto();

    dto.avg = entity.avg;
    dto.count = entity.count;
    dto.max = entity.max;
    dto.min = entity.min;
    dto.sum = entity.sum;

    return dto;
  }
}

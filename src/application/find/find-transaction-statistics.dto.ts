import { TransactionStatisticsVO } from 'src/domain/value-objects/transaction-statistics.vo';
import { ApiProperty } from '@nestjs/swagger';

export class FindTransactionStatisticsDto {
  @ApiProperty({
    description: 'Número total de transações',
    example: 10,
    type: 'number',
  })
  count: number;

  @ApiProperty({
    description: 'Soma total de todas as transações',
    example: 125.5,
    type: 'number',
  })
  sum: number;

  @ApiProperty({
    description: 'Valor médio das transações',
    example: 12.55,
    type: 'number',
  })
  avg: number;

  @ApiProperty({
    description: 'Menor valor de transação',
    example: 5.0,
    type: 'number',
  })
  min: number;

  @ApiProperty({
    description: 'Maior valor de transação',
    example: 50.0,
    type: 'number',
  })
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

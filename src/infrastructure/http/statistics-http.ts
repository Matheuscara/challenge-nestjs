import { Controller, Get } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  FindTransactionStatisticsDto,
  FindTransactionStatisticsUseCase,
} from '../../application';

@ApiTags('statistics')
@Controller('statistics')
export class StatisticsController {
  constructor(
    private readonly findTransactionStatisticsUseCase: FindTransactionStatisticsUseCase,
  ) {}

  @Get()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Obter estatísticas das transações' })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas das transações dos últimos 60 segundos',
    type: FindTransactionStatisticsDto,
    example: {
      count: 10,
      sum: 125.5,
      avg: 12.55,
      min: 5.0,
      max: 50.0,
    },
  })
  get(): FindTransactionStatisticsDto {
    return this.findTransactionStatisticsUseCase.execute();
  }
}

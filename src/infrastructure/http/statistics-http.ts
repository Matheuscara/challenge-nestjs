import { Controller, Get } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  FindTransactionStatisticsDto,
  FindTransactionStatisticsUseCase,
} from '../../application';

@Controller('statistics')
export class StatisticsController {
  constructor(
    private readonly findTransactionStatisticsUseCase: FindTransactionStatisticsUseCase,
  ) {}

  @Get()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  get(): FindTransactionStatisticsDto {
    return this.findTransactionStatisticsUseCase.execute();
  }
}

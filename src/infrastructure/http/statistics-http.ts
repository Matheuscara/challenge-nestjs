import { Controller, Get } from '@nestjs/common';
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
  get(): FindTransactionStatisticsDto {
    return this.findTransactionStatisticsUseCase.execute();
  }
}

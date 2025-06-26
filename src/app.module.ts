import { Module } from '@nestjs/common';
import { LoggerModule } from './utils/logger';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import {
  CreateTransactionUseCase,
  DeleteAllTransactionsUseCase,
  FindTransactionStatisticsUseCase,
} from './application';
import {
  CacheModule,
  StatisticsController,
  TransactionController,
} from './infrastructure';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({}),
    }),
    CacheModule,
  ],
  controllers: [TransactionController, StatisticsController],
  providers: [
    CreateTransactionUseCase,
    DeleteAllTransactionsUseCase,
    FindTransactionStatisticsUseCase,
  ],
})
export class AppModule {}

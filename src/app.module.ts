import { Module } from '@nestjs/common';
import { LoggerModule } from './utils/logger';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
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
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    CacheModule,
  ],
  controllers: [TransactionController, StatisticsController],
  providers: [
    CreateTransactionUseCase,
    DeleteAllTransactionsUseCase,
    FindTransactionStatisticsUseCase,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

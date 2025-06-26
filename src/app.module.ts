import { Module } from '@nestjs/common';
import { LoggerModule } from './utils/logger';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
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
  HealthController,
} from './infrastructure';
import { HttpModule } from '@nestjs/axios';
import { LoggingInterceptor } from './utils/interceptors/ logging.interceptor';

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
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    CacheModule,
  ],
  controllers: [TransactionController, StatisticsController, HealthController],
  providers: [
    CreateTransactionUseCase,
    DeleteAllTransactionsUseCase,
    FindTransactionStatisticsUseCase,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}

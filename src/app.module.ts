import { Module } from '@nestjs/common';
import { LoggerModule } from './utils/logger';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { TransactionController } from './infrastructure/http/transaction-http';
import { CreateTransactionUseCase } from './application/create-transaction.usecase';
import { CacheModule } from './infrastructure/cache/cache.model';
import { DeleteAllTransactionsUseCase } from './application/delete-all-transactions.usecase';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({}),
    }),
    CacheModule
  ],
  controllers: [TransactionController],
  providers: [CreateTransactionUseCase, DeleteAllTransactionsUseCase],
})
export class AppModule {}

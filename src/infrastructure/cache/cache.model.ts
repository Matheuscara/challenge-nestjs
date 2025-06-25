import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ITransactionRepository } from '../../domain/repositories/transaction.repository';
import { TransactionRepositoryImpl } from './repositories-impl/transaction.repository.impl';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: ITransactionRepository,
      useClass: TransactionRepositoryImpl,
    },
  ],
  exports: [ITransactionRepository],
})
export class CacheModule {}

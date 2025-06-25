import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ITransactionRepository } from 'src/domain/repositories/repository.repository';
import { TransactionRepositoryImpl } from './repository-impl/transaction.repository.impl';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: ITransactionRepository,
      useClass: TransactionRepositoryImpl,
    },
  ],
  exports: [TransactionRepositoryImpl],
})
export class DatabaseVitrumModule {}

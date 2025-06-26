import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  CreateTransactionUseCase,
  CreateTransactionDto,
  DeleteAllTransactionsUseCase,
} from '../../application';
import { ResponseMessages } from '../../utils/constants/response-messages';

@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly deleteAllTransactionsUseCase: DeleteAllTransactionsUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  create(@Body() dto: CreateTransactionDto): string {
    this.createTransactionUseCase.execute(dto);

    return ResponseMessages.TRANSACTION_CREATED;
  }

  @Delete()
  @Throttle({ default: { limit: 2, ttl: 60000 } })
  deleteAll(): string {
    this.deleteAllTransactionsUseCase.execute();

    return ResponseMessages.TRANSACTIONS_CLEARED;
  }
}

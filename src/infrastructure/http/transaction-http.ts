import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Delete,
} from '@nestjs/common';
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
  create(@Body() dto: CreateTransactionDto): string {
    this.createTransactionUseCase.execute(dto);

    return ResponseMessages.TRANSACTION_CREATED;
  }

  @Delete()
  deleteAll(): string {
    this.deleteAllTransactionsUseCase.execute();

    return ResponseMessages.TRANSACTIONS_CLEARED;
  }
}

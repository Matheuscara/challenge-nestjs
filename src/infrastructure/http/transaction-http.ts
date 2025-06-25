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
  async create(@Body() dto: CreateTransactionDto): Promise<string> {
    await this.createTransactionUseCase.execute(dto);

    return ResponseMessages.TRANSACTION_CREATED;
  }

  @Delete()
  async delete(): Promise<string> {
    await this.deleteAllTransactionsUseCase.execute();

    return ResponseMessages.TRANSACTIONS_CLEARED;
  }
}

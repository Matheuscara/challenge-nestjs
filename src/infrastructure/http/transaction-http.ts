import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import {
  CreateTransactionUseCase,
  CreateTransactionDto,
  DeleteAllTransactionsUseCase,
} from '../../application';
import { ResponseMessages } from '../../utils/constants/response-messages';
import { SuccessResponseDto } from '../../application/common/success-response.dto';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly deleteAllTransactionsUseCase: DeleteAllTransactionsUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Criar uma nova transação' })
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse({
    status: 201,
    description: 'Transação criada com sucesso',
    type: SuccessResponseDto,
    example: { message: 'Transação criada com sucesso' },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
    example: {
      statusCode: 400,
      message: [
        'amount deve ser um número',
        'timestamp deve ser uma data válida',
      ],
      error: 'Bad Request',
    },
  })
  @ApiResponse({
    status: 204,
    description: 'Transação expirada (mais de 60 segundos)',
  })
  create(@Body() dto: CreateTransactionDto): string {
    this.createTransactionUseCase.execute(dto);

    return ResponseMessages.TRANSACTION_CREATED;
  }

  @Delete()
  @Throttle({ default: { limit: 2, ttl: 60000 } })
  @ApiOperation({ summary: 'Deletar todas as transações' })
  @ApiResponse({
    status: 200,
    description: 'Todas as transações foram deletadas',
    type: SuccessResponseDto,
    example: { message: 'Todas as transações foram deletadas com sucesso' },
  })
  deleteAll(): string {
    this.deleteAllTransactionsUseCase.execute();

    return ResponseMessages.TRANSACTIONS_CLEARED;
  }
}

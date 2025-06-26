import { IsNumber, IsNotEmpty, IsDate } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'Valor da transação',
    example: 12.5,
    type: 'number',
  })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  amount: number;

  @ApiProperty({
    description: 'Data e hora da transação',
    example: '2024-01-01T10:30:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate({ message: 'timestamp deve ser uma data válida' })
  timestamp: Date;
}

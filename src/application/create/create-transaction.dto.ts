import { IsNumber, IsNotEmpty, IsDate } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  amount: number;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate({ message: 'timestamp deve ser uma data válida' })
  timestamp: Date;
}

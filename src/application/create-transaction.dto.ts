import { IsNumber, IsNotEmpty } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IsNotFutureDate } from '../utils/validators/is-not-future-date.validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  amount: number;

  @IsNotEmpty()
  @Type(() => Date)
  @IsNotFutureDate({ message: 'Timestamp cannot be in the future' })
  timestamp: Date;
}

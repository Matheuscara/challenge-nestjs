import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDto {
  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Operação realizada com sucesso',
    type: 'string',
  })
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}

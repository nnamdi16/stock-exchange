import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateQuoteDto {
  readonly symbol: string;
  readonly price: number;
}

export class FetchQuoteQueryDTO {
  @ApiProperty({
    description: 'Quote symbol',
    example: 'MSFT',
    title: 'symbol',
    required: true,
    type: String,
  })
  @IsString()
  @Transform(({ value }) => value.toUpperCase())
  symbol: string;
}

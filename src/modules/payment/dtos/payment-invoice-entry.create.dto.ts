import { ApiProperty } from '@nestjs/swagger';
import {IsInt, IsOptional, IsPositive } from 'class-validator';

import { Type } from 'class-transformer';
export class CreatePaymentInvoiceEntryDto {
  @ApiProperty({
    example: 1,
    type: Number,
  })
  invoiceId?: number;

  @ApiProperty({
    example: '150.0',
    type: Number,
  })
  @IsPositive()
  amount?: number;

  @ApiProperty({
    example: 1,
    type: Number,
  })

  // ⭐ IMPORTANT
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  digitAfterComma?: number;
}

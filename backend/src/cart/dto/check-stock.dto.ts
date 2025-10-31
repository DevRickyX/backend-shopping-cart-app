import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsPositive, Min } from 'class-validator';

export class CheckStockDto {
  @ApiProperty({
    description: 'Item ID to check',
    example: '507f1f77bcf86cd799439011',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  itemId: string;

  @ApiProperty({
    description: 'Requested quantity',
    example: 2,
    type: Number,
    minimum: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(1)
  quantity: number;
}

export class CheckStockResponseDto {
  @ApiProperty({
    description: 'Whether the requested quantity is available',
    example: true,
    type: Boolean,
  })
  available: boolean;

  @ApiProperty({
    description: 'Current stock available',
    example: 10,
    type: Number,
  })
  availableStock: number;

  @ApiProperty({
    description: 'Requested quantity',
    example: 2,
    type: Number,
  })
  requestedQuantity: number;
}


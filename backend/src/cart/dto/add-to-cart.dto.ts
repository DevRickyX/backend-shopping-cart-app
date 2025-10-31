import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsPositive, Min } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({
    description: 'Item ID to add to cart',
    example: '507f1f77bcf86cd799439011',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  itemId: string;

  @ApiProperty({
    description: 'Quantity to add',
    example: 1,
    type: Number,
    minimum: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(1)
  quantity: number;
}


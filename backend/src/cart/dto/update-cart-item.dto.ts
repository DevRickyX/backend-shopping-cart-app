import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class UpdateCartItemDto {
  @ApiProperty({
    description: 'Item ID in cart',
    example: '507f1f77bcf86cd799439011',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  itemId: string;

  @ApiProperty({
    description: 'New quantity (0 to remove from cart)',
    example: 2,
    type: Number,
    minimum: 0,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  quantity: number;
}


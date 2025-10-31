import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export class CartItemValidationDto {
  @ApiProperty({
    description: 'Item ID',
    example: '507f1f77bcf86cd799439011',
    type: String,
  })
  itemId: string;

  @ApiProperty({
    description: 'Requested quantity',
    example: 2,
    type: Number,
  })
  quantity: number;
}

export class CartValidationDto {
  @ApiProperty({
    description: 'Array of cart items to validate',
    type: [CartItemValidationDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CartItemValidationDto)
  items: CartItemValidationDto[];
}

export class CartValidationResponseDto {
  @ApiProperty({
    description: 'Whether all items are valid',
    example: true,
    type: Boolean,
  })
  isValid: boolean;

  @ApiProperty({
    description: 'Array of validation errors',
    type: [String],
    example: ['Item 507f1f77bcf86cd799439011: insufficient stock'],
  })
  errors: string[];
}


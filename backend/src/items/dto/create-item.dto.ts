import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsEnum,
  IsDateString,
  Min,
  MaxLength,
} from 'class-validator';
import { ItemType } from '../schemas/item.schema';

export class CreateItemDto {
  @ApiProperty({
    description: 'Type of item',
    enum: ItemType,
    example: ItemType.PRODUCT,
  })
  @IsNotEmpty()
  @IsEnum(ItemType)
  type: ItemType;

  @ApiProperty({
    description: 'Name of the item',
    example: 'Tractor John Deere 5075E',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  name: string;

  @ApiProperty({
    description: 'Description of the item',
    example:
      'Tractor agrícola de 75 HP con transmisión PowerShift, ideal para labranza y siembra',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({
    description: 'Price of the item (must be greater than 0)',
    example: 45000.0,
    type: Number,
    minimum: 0.01,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({
    description: 'Thumbnail image URL',
    example: 'https://example.com/image.jpg',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiProperty({
    description: 'Stock quantity available',
    example: 10,
    type: Number,
    minimum: 0,
    default: 0,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  stock: number;

  // Product-specific fields
  @ApiProperty({
    description: 'Category of the product (only for product type)',
    example: 'Maquinaria Agrícola',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string;

  // Event-specific fields
  @ApiProperty({
    description: 'Date of the event (only for event type)',
    example: '2024-12-25',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsDateString()
  eventDate?: string;

  @ApiProperty({
    description: 'Location of the event (only for event type)',
    example: 'Convention Center, Room A',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;

  @ApiProperty({
    description: 'Maximum capacity of the event (only for event type)',
    example: 100,
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  capacity?: number;

  @ApiProperty({
    description: 'Start time of the event (only for event type)',
    example: '09:00',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiProperty({
    description: 'End time of the event (only for event type)',
    example: '17:00',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  endTime?: string;
}


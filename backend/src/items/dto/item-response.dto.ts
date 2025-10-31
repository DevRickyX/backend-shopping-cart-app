import { ApiProperty } from '@nestjs/swagger';
import { ItemType } from '../schemas/item.schema';

export class ItemResponseDto {
  @ApiProperty({
    description: 'Unique ID of the item',
    example: '507f1f77bcf86cd799439011',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Type of item',
    enum: ItemType,
    example: ItemType.PRODUCT,
  })
  type: ItemType;

  @ApiProperty({
    description: 'Name of the item',
    example: 'Tractor John Deere 5075E',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'Description of the item',
    example:
      'Tractor agrícola de 75 HP con transmisión PowerShift, ideal para labranza y siembra',
    type: String,
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Price of the item',
    example: 45000.0,
    type: Number,
  })
  price: number;

  @ApiProperty({
    description: 'Thumbnail image URL',
    example: 'https://example.com/image.jpg',
    type: String,
    required: false,
  })
  thumbnail?: string;

  @ApiProperty({
    description: 'Stock quantity available',
    example: 10,
    type: Number,
  })
  stock: number;

  @ApiProperty({
    description: 'Category of the product (only for product type)',
    example: 'Maquinaria Agrícola',
    type: String,
    required: false,
  })
  category?: string;

  @ApiProperty({
    description: 'Date of the event (only for event type)',
    example: '2024-12-25T00:00:00.000Z',
    type: Date,
    required: false,
  })
  eventDate?: Date;

  @ApiProperty({
    description: 'Location of the event (only for event type)',
    example: 'Convention Center, Room A',
    type: String,
    required: false,
  })
  location?: string;

  @ApiProperty({
    description: 'Maximum capacity of the event (only for event type)',
    example: 100,
    type: Number,
    required: false,
  })
  capacity?: number;

  @ApiProperty({
    description: 'Start time of the event (only for event type)',
    example: '09:00',
    type: String,
    required: false,
  })
  startTime?: string;

  @ApiProperty({
    description: 'End time of the event (only for event type)',
    example: '17:00',
    type: String,
    required: false,
  })
  endTime?: string;

  @ApiProperty({
    description: 'Created timestamp',
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Updated timestamp',
    type: Date,
  })
  updatedAt: Date;
}


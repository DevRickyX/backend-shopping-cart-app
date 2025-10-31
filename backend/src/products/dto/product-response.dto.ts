import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({
    description: 'ID único del producto',
    example: '507f1f77bcf86cd799439011',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Tractor John Deere 5075E',
    type: String,
  })
  nombre: string;

  @ApiProperty({
    description: 'Descripción del producto',
    example:
      'Tractor agrícola de 75 HP con transmisión PowerShift, ideal para labranza y siembra',
    type: String,
    required: false,
  })
  descripcion?: string;

  @ApiProperty({
    description: 'Precio del producto',
    example: 45000.0,
    type: Number,
  })
  precio: number;

  @ApiProperty({
    description: 'Categoría del producto',
    example: 'Maquinaria Agrícola',
    type: String,
    required: false,
  })
  categoria?: string;
}

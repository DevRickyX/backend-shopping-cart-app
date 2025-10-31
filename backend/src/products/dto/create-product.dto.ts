import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Tractor John Deere 5075E',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiProperty({
    description: 'Descripción del producto',
    example:
      'Tractor agrícola de 75 HP con transmisión PowerShift, ideal para labranza y siembra',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({
    description: 'Precio del producto (debe ser mayor que 0)',
    example: 45000.0,
    type: Number,
    minimum: 0.01,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  precio: number;

  @ApiProperty({
    description: 'Categoría del producto',
    example: 'Maquinaria Agrícola',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  categoria?: string;
}

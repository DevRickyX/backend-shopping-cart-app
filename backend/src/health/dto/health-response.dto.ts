import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({
    description: 'Estado de la aplicación',
    example: 'ok',
    type: String,
  })
  status: string;
}

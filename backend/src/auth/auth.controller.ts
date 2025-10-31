import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { TokenResponseDto } from './dto/token-response.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token')
  @ApiOperation({
    summary: 'Obtener token JWT',
    description:
      'Genera un token JWT para autenticar las peticiones a los endpoints protegidos',
  })
  @ApiResponse({
    status: 201,
    description: 'Token JWT generado exitosamente',
    type: TokenResponseDto,
  })
  async getToken(): Promise<TokenResponseDto> {
    return this.authService.generateToken();
  }
}

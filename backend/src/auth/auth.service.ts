import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface JwtPayload {
  sub: string;
  username: string;
}

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  generateToken(): Promise<{ access_token: string }> {
    const payload: JwtPayload = { sub: 'admin', username: 'admin' };
    const access_token = this.jwtService.sign(payload);
    return Promise.resolve({ access_token });
  }

  validateUser(id: string): Promise<boolean> {
    // Simple validation - just check if it's our admin user
    return Promise.resolve(id === 'admin');
  }
}

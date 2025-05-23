import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    const userData = await this.authService.validateUser(email, password);
    if (!userData) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const user = {
      id: userData.id,
      email: userData.email,
      role: userData.role,
    };
    return user;
  }
}

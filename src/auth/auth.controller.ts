import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create.dto';
import { LocalAuthGuard } from '../lib/guard/local-auth.guard';
import { User } from '../lib/decorators/user.decorator';
import { JwtAuthGuard } from '../lib/guard/jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';
import { RolesGuard } from 'src/lib/guard/roles.guard';
import { Roles } from 'src/lib/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  @Throttle({ default: { limit: 3, ttl: 300000 } })
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@User() user: { id: string; email: string; role: string }) {
    return this.authService.login(user);
  }

  @Throttle({ default: { limit: 15, ttl: 1000 } })
  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.user)
  async getProfile(@User() user: { id: string; email: string; role: string }) {
    return await this.authService.userDetails(user.id);
  }
}

import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create.dto';
import { LocalAuthGuard } from '../lib/guard/local-auth.guard';
import { User } from '../lib/decorators/user.decorator';
import { JwtAuthGuard } from '../lib/guard/jwt-auth.guard';
// import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@User() user: { id: string; email: string; role: string }) {
    return this.authService.login(user);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@User() user: { id: string; email: string; role: string }) {
    return await this.authService.userDetails(user.id);
  }
}

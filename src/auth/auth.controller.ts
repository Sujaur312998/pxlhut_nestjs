import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create.dto';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { User } from './decorators/user.decorator';

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
}

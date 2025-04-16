/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from './dto/create.dto';
import * as bcrypt from 'bcrypt';
import { PayloadDto } from './dto/payload.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    try {
      const userExist = await this.userService.findByEmail(email);
      if (userExist) {
        this.logger.warn(`Attempt to register with existing email: ${email}`);
        throw new ConflictException('Email is already registered');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await this.userService.createUser({
        ...createUserDto,
        password: hashedPassword,
      });

      this.logger.log(`New user registered: ${newUser.email}`);
      return newUser;
    } catch (error) {
      this.logger.error(
        `Failed to register user: ${email}`,
        error?.stack ?? '',
      );

      if (error instanceof ConflictException) throw error;

      if (error?.name === 'QueryFailedError') {
        if (error?.message.includes('duplicate key')) {
          throw new ConflictException('Email already exists in database');
        }
        throw new InternalServerErrorException('Database query failed');
      }

      if (error?.name === 'BcryptError' || error instanceof TypeError) {
        throw new InternalServerErrorException(
          'Internal server error during password hashing',
        );
      }

      // Fallback
      throw new InternalServerErrorException(
        'Unexpected error occurred during registration',
      );
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(payload: PayloadDto) {
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    await this.userService.updateRefreshToken(payload.id, refreshToken);
    return { accessToken, refreshToken };
  }

  async validateToken(payload: PayloadDto) {
    const user = await this.userService.findById(payload.id);
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  async userDetails(id: string) {
    return await this.userService.findById(id);
  }
}

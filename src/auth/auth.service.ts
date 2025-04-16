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

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly userService: UserService) {}

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
}

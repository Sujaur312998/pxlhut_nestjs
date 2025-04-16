import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  email: string;

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  password: string;
}

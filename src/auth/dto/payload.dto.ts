import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class PayloadDto {
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  id: string;

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  email: string;
}

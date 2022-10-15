import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { Match } from '../../decorators/match.decorator';

export class CreateUserDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(16)
  password: string;

  @IsNotEmpty()
  @Match('password', {
    message: 'passwords do not match',
  })
  confirmPassword: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}

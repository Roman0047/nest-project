import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { Match } from '../../decorators/match.decorator';
import { User } from '../../typeorm/User';
import { IsUniqueOnDatabase } from '../../validations/is-unique.validation';

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
  // @IsUniqueOnDatabase(User, { message: 'This email already exists' })
  readonly email: string;
}

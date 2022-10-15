import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { Match } from '../../decorators/match.decorator';
import { IsUniqueOnDatabase } from '../../validations/is-unique.validation';
import { User } from '../../typeorm/User';

export class UpdateUserDto {
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
  // @IsUniqueOnDatabase(User, { message: 'This email already exists' }) //todo fix Unique validation
  readonly email: string;
}

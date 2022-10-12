import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(16)
  password: string;

  @IsNotEmpty()
  readonly email: string;
}

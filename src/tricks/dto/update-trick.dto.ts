import { IsNotEmpty } from 'class-validator';

export class UpdateTrickDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly description: string;

  @IsNotEmpty()
  readonly file: string;

  @IsNotEmpty()
  readonly complexity: string;
}

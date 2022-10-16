import { IsNotEmpty } from 'class-validator';

export class CreateSportDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly description: string;

  @IsNotEmpty()
  readonly image: string;
}

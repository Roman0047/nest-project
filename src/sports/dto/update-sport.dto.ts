import { IsNotEmpty } from 'class-validator';

export class UpdateSportDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly description: string;

  @IsNotEmpty()
  readonly image: string;
}

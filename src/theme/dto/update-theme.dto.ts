import { IsNotEmpty } from 'class-validator';

export class UpdateThemeDto {
  @IsNotEmpty()
  readonly font: string;

  @IsNotEmpty()
  readonly backgroundImage: string;
}

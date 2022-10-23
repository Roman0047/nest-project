import { IsNotEmpty } from 'class-validator';

export class UpdateThemeDto {
  @IsNotEmpty()
  readonly font: string;
}

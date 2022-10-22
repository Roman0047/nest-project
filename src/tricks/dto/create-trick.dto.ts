import { IsNotEmpty } from 'class-validator';
import { Sport } from '../../typeorm/Sport';

export class CreateTrickDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly description: string;

  @IsNotEmpty()
  readonly file: string;

  @IsNotEmpty()
  readonly complexity: string;

  sport: Sport;
}

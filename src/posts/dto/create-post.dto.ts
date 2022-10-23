import { IsNotEmpty } from 'class-validator';
import { Sport } from '../../typeorm/Sport';
import { Trick } from '../../typeorm/Trick';

export class CreatePostDto {
  @IsNotEmpty()
  readonly title: string;

  readonly description: string;

  @IsNotEmpty()
  readonly file: string;

  sport: Sport;

  trick: Trick;
}

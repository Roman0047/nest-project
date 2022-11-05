import { IsEnum, IsNotEmpty } from 'class-validator';
import { Rating } from '../../enums/rating.enum';

export class CreateRatingDto {
  @IsNotEmpty()
  @IsEnum(Rating)
  readonly rating: Rating;
}

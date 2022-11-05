import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../typeorm/User';
import { Rating } from '../typeorm/Rating';
import { CreateRatingDto } from './dto/create-rating.dto';
import { PostsService } from '../posts/posts.service';
import { Rating as RatingEnum } from '../enums/rating.enum';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
    @Inject(forwardRef(() => PostsService))
    private postsService: PostsService,
  ) {}

  async create(id, user: User, dto: CreateRatingDto) {
    const activeRating = await this.getActiveRating(user.id, id);

    if (activeRating && activeRating.rating === dto.rating) {
      await this.ratingRepository.delete(activeRating.id);
      return this.getPostRatingsCount(activeRating.postId);
    }

    if (activeRating) {
      const rating = this.ratingRepository.create(dto);
      if (!rating.id) {
        rating.id = activeRating.id;
      }
      await this.ratingRepository.save(rating);
      const currentRating = await this.ratingRepository.findOne({
        where: {
          id: rating.id,
        },
      });
      return this.getPostRatingsCount(currentRating.postId);
    } else {
      const rating = this.ratingRepository.create(dto);
      rating.user = user;
      rating.post = await this.postsService.getNativeById(id);
      const currentRating = await this.ratingRepository.save(rating);
      return this.getPostRatingsCount(currentRating.postId);
    }
  }

  async getActiveRating(userId, postId) {
    return await this.ratingRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        post: {
          id: postId,
        },
      },
    });
  }

  async getPostRatingsCount(id) {
    return {
      likes: await this.ratingRepository.count({
        where: {
          post: { id },
          rating: RatingEnum.Positive,
        },
      }),
      dislikes: await this.ratingRepository.count({
        where: {
          post: { id },
          rating: RatingEnum.Negative,
        },
      }),
    };
  }
}

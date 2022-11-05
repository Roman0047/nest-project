import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { In, Like, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from '../typeorm/Post';
import { User } from '../typeorm/User';
import { SubscribersService } from '../subscribers/subscribers.service';
import { Sport } from '../typeorm/Sport';
import { RatingsService } from '../ratings/ratings.service';
// import { Rating } from '../enums/rating.enum';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Sport)
    private readonly sportRepository: Repository<Sport>,
    private subscribersService: SubscribersService,
    @Inject(forwardRef(() => RatingsService))
    private ratingsService: RatingsService,
  ) {}

  async getFilteredPosts(sportsIds, tricksIds) {
    const sports = await this.sportRepository.find({
      where: { id: In(sportsIds) },
      relations: {
        posts: {
          sport: true,
          trick: true,
          user: true,
        },
      },
    });
    const sportsPosts = [];
    sports.forEach((item) => sportsPosts.push(...item.posts));

    if (tricksIds && tricksIds.length) {
      const tricksPosts = [];

      sports.forEach((sport: any) => {
        const hasTricks = !!sport.tricksIds.find((id: any) =>
          tricksIds.find((trickId) => parseInt(trickId) === id),
        );

        if (hasTricks) {
          sport.posts.forEach((item: any) => {
            if (
              item.trick &&
              tricksIds.find((trickId) => parseInt(trickId) === item.trick.id)
            ) {
              tricksPosts.push(item);
            }
          });
        } else {
          tricksPosts.push(...sport.posts);
        }
      });

      return tricksPosts;
    } else {
      return sportsPosts;
    }
  }

  async getAll({
    sport,
    trick,
    user,
    userId,
    sportId,
    trickId,
    postId,
    search,
    sportsIds,
    tricksIds,
    limit,
  }) {
    if (sportsIds && sportsIds.length) {
      const posts: any = await this.getFilteredPosts(sportsIds, tricksIds);
      return posts.filter((item: any) => item.title.includes(search || ''));
    } else {
      const posts = await this.postRepository.find({
        where: {
          title: Like(`%${search || ''}%`),
          ...(userId && { user: { id: userId } }),
          ...(sportId && { sport: { id: sportId }, id: Not(postId) }),
          ...(trickId && { trick: { id: trickId }, id: Not(postId) }),
        },
        relations: {
          sport: !!sport,
          trick: !!trick,
          user: !!user,
          // ratings: true,
        },
        order: { id: 'DESC' },
        take: limit,
      });
      // return posts.map((post: any) => {
      //   post.likes = post.ratings.filter(
      //     (rating) => rating.rating === Rating.Positive,
      //   );
      //   post.dislikes = post.ratings.filter(
      //     (rating) => rating.rating === Rating.Negative,
      //   );
      //   return post;
      // });

      return await Promise.all(
        posts.map(async (post) => {
          return {
            ...post,
            ratings: await this.ratingsService.getPostRatingsCount(post.id),
          };
        }),
      );
    }
  }

  async getSubscriptionsPosts(id, sportsIds, tricksIds, search) {
    const subscriptions = await this.subscribersService.getSubscriptions(id);
    const subscriptionsIds = subscriptions.map((item) => item.userId);

    if (sportsIds && sportsIds.length) {
      const posts: any = await this.getFilteredPosts(sportsIds, tricksIds);
      const filteredSports = posts.filter(
        (item: any) =>
          item.title.includes(search || '') &&
          subscriptionsIds.find(
            (subscription) => subscription === item.user.id,
          ),
      );

      return await Promise.all(
        filteredSports.map(async (post) => {
          return {
            ...post,
            ratings: await this.ratingsService.getPostRatingsCount(post.id),
          };
        }),
      );
    } else {
      const posts = await this.postRepository.find({
        where: {
          user: {
            id: In(subscriptionsIds),
          },
        },
        relations: {
          sport: true,
          trick: true,
          user: true,
        },
        order: { id: 'DESC' },
      });

      return await Promise.all(
        posts.map(async (post) => {
          return {
            ...post,
            ratings: await this.ratingsService.getPostRatingsCount(post.id),
          };
        }),
      );
    }
  }

  async getById(id: string, userId?) {
    if (!parseInt(id)) throw new NotFoundException();

    const item = await this.postRepository.findOne({
      where: { id: parseInt(id) },
      relations: {
        sport: true,
        trick: true,
        user: true,
      },
    });
    if (item) {
      let isSubscribed = false;

      if (userId) {
        isSubscribed = !!(await this.subscribersService.getActiveSubscription(
          item.user.id,
          userId,
        ));
      }
      return {
        ...item,
        ratings: await this.ratingsService.getPostRatingsCount(item.id),
        user: {
          ...item.user,
          isSubscribed,
        },
      };
    }
    throw new NotFoundException();
  }

  async getNativeById(id: string) {
    if (!parseInt(id)) throw new NotFoundException();

    const item = await this.postRepository.findOne({
      where: { id: parseInt(id) },
    });
    if (item) {
      return item;
    }
    throw new NotFoundException();
  }

  create(dto: CreatePostDto, user: User) {
    const post = this.postRepository.create(dto);
    post.user = user;
    post.sport = dto.sport;
    post.trick = dto.trick;
    return this.postRepository.save(post);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { In, Like, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from '../typeorm/Post';
import { User } from '../typeorm/User';
import { SubscribersService } from '../subscribers/subscribers.service';
import { Sport } from '../typeorm/Sport';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Sport)
    private readonly sportRepository: Repository<Sport>,
    private subscribersService: SubscribersService,
  ) {}

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
  }) {
    if (sportsIds && sportsIds.length) {
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
    } else {
      return await this.postRepository.find({
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
        },
        order: { id: 'DESC' },
      });
    }
  }

  async getSubscriptionsPosts(id) {
    const subscriptions = await this.subscribersService.getSubscriptions(id);
    const subscriptionsIds = subscriptions.map((item) => item.userId);
    return this.postRepository.find({
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
  }

  async getById(id: string, userId) {
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
      const isSubscribed =
        !!(await this.subscribersService.getActiveSubscription(
          item.user.id,
          userId,
        ));

      return {
        ...item,
        user: {
          ...item.user,
          isSubscribed,
        },
      };
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

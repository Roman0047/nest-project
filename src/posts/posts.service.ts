import { Injectable, NotFoundException } from '@nestjs/common';
import { In, Like, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from '../typeorm/Post';
import { User } from '../typeorm/User';
import { SubscribersService } from '../subscribers/subscribers.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private subscribersService: SubscribersService,
  ) {}

  getAll({
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
    return this.postRepository.find({
      where: {
        title: Like(`%${search || ''}%`),
        ...(userId && { user: { id: userId } }),
        ...(sportId && { sport: { id: sportId }, id: Not(postId) }),
        ...(trickId && { trick: { id: trickId }, id: Not(postId) }),

        ...(sportsIds && { sport: { id: In(sportsIds) } }),
        ...(tricksIds && { trick: { id: In(tricksIds) } }),
      },
      relations: {
        sport: !!sport,
        trick: !!trick,
        user: !!user,
      },
      order: { id: 'DESC' },
    });
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

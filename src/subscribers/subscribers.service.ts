import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../typeorm/User';
import { Subscriber } from '../typeorm/Subscriber';
import { UsersService } from '../users/users.service';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  getSubscriptions(id, user?) {
    return this.subscriberRepository.find({
      where: {
        subscriber: { id },
      },
      relations: { user },
    });
  }

  async getSubscriptionsUsers(id) {
    const subscriptions = await this.getSubscriptions(id, true);
    return subscriptions.map((item) => {
      delete item.user.password;
      return item.user;
    });
  }

  getSubscribersLength(id) {
    return this.subscriberRepository.count({
      where: {
        user: { id },
      },
    });
  }

  async create(id, user: User) {
    const activeSubscription = await this.getActiveSubscription(id, user.id);
    if (activeSubscription) {
      await this.subscriberRepository.delete(activeSubscription.id);
      return 'Unsubscribed';
    } else {
      const subscriber = this.subscriberRepository.create();
      subscriber.user = await this.usersService.getById(id);
      subscriber.subscriber = user;
      await this.subscriberRepository.save(subscriber);
      return 'Subscribed';
    }
  }

  async getActiveSubscription(userId, subscriberId) {
    return await this.subscriberRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        subscriber: {
          id: subscriberId,
        },
      },
    });
  }
}

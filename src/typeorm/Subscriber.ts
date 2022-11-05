import { Entity, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { User } from './User';

@Entity()
export class Subscriber {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.subscriptions, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => User, (user) => user.subscribers, { onDelete: 'SET NULL' })
  subscriber: User;

  @RelationId((subscriber: Subscriber) => subscriber.user)
  userId: number;

  @RelationId((subscriber: Subscriber) => subscriber.subscriber)
  subscriberId: number;
}

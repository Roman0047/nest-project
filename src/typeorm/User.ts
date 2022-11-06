import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../enums/role.enum';
import { Theme } from './Theme';
import { Post } from './Post';
import { Subscriber } from './Subscriber';
import { Rating } from './Rating';
import { Sport } from './Sport';
import { Trick } from './Trick';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column({
    nullable: true,
  })
  avatar: string;

  @Column({
    nullable: false,
    default: 'user',
  })
  role: Role;

  @OneToOne(() => Theme, (theme) => theme.user)
  theme: Theme;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Subscriber, (subscriber) => subscriber.user)
  subscribers: Subscriber[];

  @OneToMany(() => Subscriber, (subscriber) => subscriber.subscriber)
  subscriptions: Subscriber[];

  @OneToMany(() => Rating, (rating) => rating.user)
  ratings: Rating[];

  @ManyToMany(() => Sport)
  @JoinTable()
  sports: Sport[];

  @ManyToMany(() => Trick)
  @JoinTable()
  tricks: Trick[];
}

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';
import { Sport } from './Sport';
import { Trick } from './Trick';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  file: string;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  user: User;

  @OneToOne(() => Sport)
  @JoinColumn()
  sport: Sport;

  @OneToOne(() => Trick)
  @JoinColumn()
  trick: Trick;
}

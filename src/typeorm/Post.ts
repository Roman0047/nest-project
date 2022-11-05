import {
  Column,
  Entity,
  ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
  RelationId
} from "typeorm";
import { User } from './User';
import { Sport } from './Sport';
import { Trick } from './Trick';
import { Rating } from "./Rating";

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

  @ManyToOne(() => Sport, (sport) => sport.posts, { onDelete: 'CASCADE' })
  sport: Sport;

  @ManyToOne(() => Trick, (trick) => trick.posts, { onDelete: 'CASCADE' })
  trick: Trick;

  @RelationId((post: Post) => post.user)
  userId: number;

  @RelationId((post: Post) => post.sport)
  sportId: number;

  @RelationId((post: Post) => post.trick)
  trickId: number;

  @OneToMany(() => Rating, (rating) => rating.post)
  ratings: Rating[];
}

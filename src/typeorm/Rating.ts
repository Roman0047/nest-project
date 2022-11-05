import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { User } from './User';
import { Post } from './Post';
import { Rating as RatingEnum } from '../enums/rating.enum';

@Entity()
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rating: RatingEnum;

  @ManyToOne(() => User, (user) => user.ratings)
  user: User;

  @ManyToOne(() => Post, (post) => post.ratings, { onDelete: 'CASCADE' })
  post: Post;

  @RelationId((rating: Rating) => rating.user)
  userId: number;

  @RelationId((rating: Rating) => rating.post)
  postId: number;
}

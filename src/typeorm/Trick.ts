import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Sport } from './Sport';
import { Post } from './Post';

@Entity()
export class Trick {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  file: string;

  @Column()
  complexity: string;

  @ManyToOne(() => Sport, (sport) => sport.tricks, { onDelete: 'CASCADE' })
  sport: Sport;

  @OneToMany(() => Post, (post) => post.trick)
  posts: Post[];
}

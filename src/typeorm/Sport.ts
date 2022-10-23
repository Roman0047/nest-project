import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Trick } from './Trick';
import { Post } from './Post';

@Entity()
export class Sport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  image: string;

  @OneToMany(() => Trick, (trick) => trick.sport)
  tricks: Trick[];

  @OneToMany(() => Post, (post) => post.sport)
  posts: Post[];
}

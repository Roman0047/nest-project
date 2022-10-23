import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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

  @ManyToOne(() => Sport, (sport) => sport.posts, { onDelete: 'CASCADE' })
  sport: Sport;

  @ManyToOne(() => Trick, (trick) => trick.posts, { onDelete: 'CASCADE' })
  trick: Trick;
}

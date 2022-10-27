import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class Subscriber {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.theme, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => User, (user) => user.theme, { onDelete: 'SET NULL' })
  subscriber: User;
}

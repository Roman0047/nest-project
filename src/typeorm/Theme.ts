import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

@Entity()
export class Theme {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    default: 'Roboto',
  })
  font: string;

  @Column({
    nullable: true,
  })
  backgroundImage: string;

  @OneToOne(() => User, (user) => user.theme, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
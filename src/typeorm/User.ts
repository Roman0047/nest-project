import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../enums/role.enum';
import { Theme } from './Theme';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    nullable: false,
    default: 'user',
  })
  role: Role;

  @OneToOne(() => Theme, (theme) => theme.user)
  theme: Theme;
}
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Trick } from './Trick';

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
}

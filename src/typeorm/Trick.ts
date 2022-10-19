import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Sport } from './Sport';

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
}

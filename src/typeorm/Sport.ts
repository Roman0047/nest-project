import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Sport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
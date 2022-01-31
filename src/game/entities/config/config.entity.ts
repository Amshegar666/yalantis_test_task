import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ConfigEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('boolean')
  shuffled: boolean;
}

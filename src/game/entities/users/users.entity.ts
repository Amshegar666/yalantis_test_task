import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { nullable: true })
  login: string;

  @Column('varchar', { nullable: true })
  password: string;

  @Column('varchar', { nullable: true })
  name: string;

  @Column('varchar', { nullable: true })
  surname: string;

  @Column('text', { nullable: true })
  gift1: string;

  @Column('text', { nullable: true })
  gift2: string;

  @Column('text', { nullable: true })
  gift3: string;

  @Column('text', { nullable: true })
  gift4: string;

  @Column('text', { nullable: true })
  gift5: string;

  @Column('text', { nullable: true })
  gift6: string;

  @Column('text', { nullable: true })
  gift7: string;

  @Column('text', { nullable: true })
  gift8: string;

  @Column('text', { nullable: true })
  gift9: string;

  @Column('text', { nullable: true })
  gift10: string;

  @Column('int', { nullable: true })
  ssid: number;
}

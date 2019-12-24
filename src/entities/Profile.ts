import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BaseEntity
} from 'typeorm';
import { User } from './User';

@Entity('PROFILE_TB', {
  synchronize: true
})
export class Profile extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: String;

  @Column({ length: 255 })
  name!: string;

  @Column({ length: 255 })
  shortBio!: string;

  @Column('timestamptz')
  @CreateDateColumn()
  created_at!: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date;

  @Column('uuid')
  fk_user_id!: string;

  @OneToOne(_type => User, { cascade: true })
  @JoinColumn({ name: 'fk_user_id' })
  user!: User;
}

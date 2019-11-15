import { Column, Entity, getRepository, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users', {
  synchronize: false
})
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true, length: 255 })
  username!: string;
}

export const createUserLoader = () => {
  const repo = getRepository(User);
  return repo;
};

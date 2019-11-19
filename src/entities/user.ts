import DataLoader from 'dataloader';
import { Column, Entity, getRepository, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users', {
  synchronize: true
})
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true, length: 255 })
  username!: string;
}

export const createUserLoader = () =>
  new DataLoader<string, User>(ids => {
    const repo = getRepository(User);
    const users = repo.findByIds(ids);
    return users;
  });

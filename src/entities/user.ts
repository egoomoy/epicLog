import bcrypt from 'bcrypt';
import DataLoader from 'dataloader';
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  getRepository,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { createToken } from '../utilities/token';
import { Profile } from './Profile';

const BCRYPT_ROUNDS = 10;

@Entity('USER_TB', {
  synchronize: true
})
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ unique: true, length: 255, nullable: true, type: 'varchar' })
  email!: string | null;

  @Column({ length: 255, nullable: true })
  password!: string;

  @Column('timestamptz')
  @CreateDateColumn()
  created_at!: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date;

  @OneToOne(
    _type => Profile,
    profile => profile.user
  )
  profile!: Profile;

  public comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  @BeforeInsert()
  @BeforeUpdate()
  async savePassword(): Promise<void> {
    if (this.password) {
      const hashedPassword = await this.hashPassword(this.password);
      this.password = hashedPassword;
    }
  }

  private hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, BCRYPT_ROUNDS);
  }

  async createUserToken() {
    // refresh token is valid for 30days
    const refreshToken = await createToken(
      { user_id: this.id },
      { subject: 'refresh_token', expiresIn: '30d' }
    );
    const accessToken = await createToken(
      { user_id: this.id },
      { subject: 'access_token', expiresIn: '5s' }
    );
    return { refreshToken, accessToken };
  }

  async refreshUserToken(tokenId: string, refreshTokenExp: number, originalRefreshToken: string) {
    const now = new Date().getTime();
    const diff = refreshTokenExp * 1000 - now;
    let refreshToken = originalRefreshToken;
    // renew refresh token if remaining life is less than 15d
    if (diff < 1000 * 60 * 60 * 24 * 15) {
      console.log('refreshing refreshToken');
      refreshToken = await createToken(
        { user_id: this.id, token_id: tokenId },
        { subject: 'refresh_token', expiresIn: '30d' }
      );
    }
    const accessToken = await createToken(
      { user_id: this.id },
      { subject: 'access_token', expiresIn: '5s' }
    );
    return { refreshToken, accessToken };
  }
}

export const createUserLoader = () =>
  new DataLoader<string, User>(ids => {
    const repo = getRepository(User);
    const users = repo.findByIds(ids);
    return users;
  });

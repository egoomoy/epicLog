import ids = require('shortid');
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
// tslint:disable-next-line: ordered-imports

@Entity('email_auth', {
  synchronize: true
})
class EmailAuth extends BaseEntity {
  @PrimaryGeneratedColumn('uuid') id!: number;

  @Column({ type: 'text' })
  code!: string;

  @Column({ length: 255, nullable: true })
  email!: string;

  @Column({ default: false })
  logged!: boolean;

  @CreateDateColumn() createdAt: string;

  @UpdateDateColumn() updatedAt: string;

  @BeforeInsert()
  createCode(): void {
    this.code = ids.generate();
  }
}

export default EmailAuth;

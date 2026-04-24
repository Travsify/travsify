import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('api_logs')
export class ApiLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  method: string;

  @Column()
  path: string;

  @Column({ type: 'json', nullable: true })
  query: any;

  @Column({ type: 'json', nullable: true })
  body: any;

  @Column({ type: 'json', nullable: true })
  response: any;

  @Column()
  statusCode: number;

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string;

  @Column({ nullable: true })
  latency: number; // in ms

  @Column({ default: 'live' })
  environment: string;

  @CreateDateColumn()
  createdAt: Date;
}

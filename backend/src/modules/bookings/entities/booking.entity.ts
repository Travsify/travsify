import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum BookingStatus {
  PENDING = 'pending',
  BOOKED = 'booked',
  CONFIRMED = 'confirmed',
  TICKETED = 'ticketed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  pnr: string;

  @Column({ nullable: true })
  providerBookId: number;

  @Column({ nullable: true })
  providerBookGuid: string;

  @Column({ nullable: true })
  ticketNumber: string;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Column({ type: 'decimal', precision: 20, scale: 2, name: 'total_amount' })
  totalPrice: number;

  @Column()
  currency: string;

  @Column({ type: 'jsonb', nullable: true })
  flightDetails: any;

  @Column({ type: 'jsonb', nullable: true })
  passengerDetails: any;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.bookings)
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

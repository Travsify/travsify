import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  apiKey: string;

  @Column({ type: 'float', default: 0 })
  flightMarkup: number; // Percentage or flat fee

  @Column({ type: 'float', default: 0 })
  hotelMarkup: number;

  @Column({ type: 'float', default: 0 })
  insuranceMarkup: number;

  @Column({ type: 'float', default: 0 })
  transferMarkup: number;

  @Column({ type: 'float', default: 0 })
  tourMarkup: number;

  @Column({ default: 'duffel' })
  flightProvider: string; // 'duffel', 'sitecity', or 'both'

  @Column({ default: false })
  ndcEnabled: boolean; // SiteCity/NDC specifically

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

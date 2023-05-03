import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IAccounts } from '../interfaces/IAccounts.interface';
import { ISchedule } from '../interfaces/ISchedule.interface';

@Entity('admin')
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  phone: string;

  @Column('text')
  address: string;

  @Column('text')
  city: string;

  @Column('text')
  province: string;

  @Column('text')
  country: string;

  @Column('text')
  storeName: string;

  @Column({ type: 'jsonb', nullable: true })
  accounts: IAccounts[];

  @Column({ type: 'jsonb', nullable: true })
  schedule: ISchedule;
}

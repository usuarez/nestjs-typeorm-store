import { User } from 'src/auth/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { orderStatusEnum } from '../enums/order-status.enum';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int')
  quantity: number;

  @Column('float')
  totalPrice: number;

  @Column('date', { default: new Date() })
  createdAt: Date;

  @Column('text', { default: orderStatusEnum.pending })
  status: string;

  @ManyToOne(() => User, (user) => user.order, { nullable: false, eager: true })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Product, (product) => product.order, {
    eager: true,
    nullable: false,
  })
  @JoinColumn()
  product: Product;
}

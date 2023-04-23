import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IDescription } from '../interfaces/productDescription.interface';
import { User } from 'src/auth/entities/user.entity';
import { Order } from 'src/orders/entities/order.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  name: string;

  @Column('float', { default: 0 })
  price: number;

  @Column({ type: 'jsonb', nullable: true })
  description: IDescription;

  @Column({ type: 'text', unique: true })
  slug: string;

  @Column('int', {
    default: 0,
  })
  stock: number;

  @Column('text', {
    array: true,
  })
  sizes: string[];

  @Column('text')
  gender: string;

  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[];

  @Column('text', {
    array: true,
    default: [],
  })
  categories: string[];

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.name;
    }
    this.slug = this.slug
      .trim()
      .toLocaleLowerCase()
      .replaceAll(' ', '-')
      .replaceAll("'", '');
  }

  @BeforeUpdate()
  checkSlugBeforeUpdate() {
    this.slug = this.slug
      .trim()
      .toLocaleLowerCase()
      .replaceAll(' ', '-')
      .replaceAll("'", '');
  }

  @ManyToOne(() => User, (user) => user.product, { eager: true })
  user: User;

  @OneToMany(() => Order, (order) => order.product)
  order: Order;
}

// main tools
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { isUUID } from 'class-validator';

// typeorm
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// dto
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

// entity
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/auth/entities/user.entity';
import { Order } from './entities/order.entity';

// services
import { ProductsService } from 'src/products/products.service';

// enum
import { orderStatusEnum } from './enums/order-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    private readonly productsService: ProductsService,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: User) {
    let product: Product;
    if (isUUID(createOrderDto.productId)) {
      product = await this.productsService.findOne(createOrderDto.productId);

      if (!product)
        throw new NotFoundException('The requested product do not exists');

      if (product.stock < 1) throw new BadRequestException('out of stock');

      if (product.stock < Number(createOrderDto.quantity))
        throw new BadRequestException('not enough stock');
    } else throw new BadRequestException('Invalid product');

    try {
      const newOrder = this.orderRepository.create({
        user: user,
        product: product,
        status: 'PENDING',
        createdAt: new Date(),
        quantity: createOrderDto.quantity,
        totalPrice: product.price * createOrderDto.quantity,
      });

      await this.orderRepository.save(newOrder);

      this.productsService.update(product.id, {
        ...product,
        stock: product.stock - Number(createOrderDto.quantity),
      });

      return newOrder;
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  async findAll(user: User) {
    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .innerJoinAndSelect('order.product', 'product')
      .where('order.userId = :uid')
      .setParameter('uid', user.id)
      .getMany();
    if (orders.length < 1) throw new NotFoundException();
    return orders;
  }

  findOne(id: string, user: User) {
    const order = this.orderRepository
      .createQueryBuilder('order')
      .innerJoinAndSelect('order.user', 'user')
      .where('order.userId = :uid', { uid: user.id })
      .andWhere('order.id = :oid', {
        oid: id,
      })
      .getOne();

    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto, user: User) {
    const order = await this.findOne(id, user);
    const { status } = updateOrderDto;

    if (!order) throw new NotFoundException('Order not found');

    if (status === orderStatusEnum.cancelledByUser && order.user.id !== user.id)
      throw new BadRequestException("You can't update orders from other users");

    if (!status)
      throw new BadRequestException('Status is required to update an order');

    if (status !== orderStatusEnum.cancelledByUser)
      throw new BadRequestException('User only can cancel orders');

    try {
      const toUpdate = await this.orderRepository.preload({
        id,
        status,
      });

      await this.orderRepository.save(toUpdate);

      return toUpdate;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async remove(id: string, user: User) {
    const deleted = await this.update(
      id,
      { status: orderStatusEnum.cancelledByAdmin },
      user,
    );
    return deleted;
  }
}

import { Module } from '@nestjs/common';

// controllers
import { OrdersController } from './orders.controller';

// entities
import { Order } from './entities/order.entity';

// modules
import { ProductsModule } from 'src/products/products.module';

// services
import { OrdersService } from './orders.service';

// typeorm
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [TypeOrmModule.forFeature([Order]), ProductsModule],
  exports: [OrdersService, TypeOrmModule],
})
export class OrdersModule {}

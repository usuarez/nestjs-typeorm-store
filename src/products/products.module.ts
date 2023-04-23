// modules
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

// services
import { ProductsService } from './products.service';

// controller
import { ProductsController } from './products.controller';

// entities
import { Product } from './entities/product.entity';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [TypeOrmModule.forFeature([Product])],
  exports: [ProductsService, TypeOrmModule],
})
export class ProductsModule {}

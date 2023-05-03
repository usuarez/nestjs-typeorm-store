import { Module } from '@nestjs/common';

// services
import { CategoriesService } from './categories.service';

// controllers
import { CategoriesController } from './categories.controller';

// entities
import { Category } from './entities/category.entity';

// typeorm
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports: [TypeOrmModule.forFeature([Category])],
  exports: [CategoriesService, TypeOrmModule],
})
export class CategoriesModule {}

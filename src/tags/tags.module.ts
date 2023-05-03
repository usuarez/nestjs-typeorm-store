import { Module } from '@nestjs/common';

// controllers
import { TagsController } from './tags.controller';

// entities
import { Tag } from './entities/tag.entity';

// services
import { TagsService } from './tags.service';

// typeorm
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [TagsController],
  providers: [TagsService],
  imports: [TypeOrmModule.forFeature([Tag])],
  exports: [TagsService, TypeOrmModule],
})
export class TagsModule {}

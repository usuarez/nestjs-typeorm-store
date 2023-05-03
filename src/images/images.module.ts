import { Module } from '@nestjs/common';

// services
import { ImagesService } from './images.service';

// controllers
import { ImagesController } from './images.controller';

// custom providers
import { CloudinaryProvider } from './images.provider';

// entities
import { Image } from './entities/image.entity';

// typeorm
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [ImagesController],
  imports: [TypeOrmModule.forFeature([Image])],
  providers: [ImagesService, CloudinaryProvider],
  exports: [TypeOrmModule],
})
export class ImagesModule {}

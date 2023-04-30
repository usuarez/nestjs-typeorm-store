import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { CloudinaryProvider } from './images.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';

@Module({
  controllers: [ImagesController],
  imports: [TypeOrmModule.forFeature([Image])],
  providers: [ImagesService, CloudinaryProvider],
  exports: [TypeOrmModule],
})
export class ImagesModule {}

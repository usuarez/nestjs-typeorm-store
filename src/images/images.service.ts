// main tools
import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as toStream from 'buffer-to-stream';

// dto
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateImageDto } from './dto/create-image.dto';

//entities
import { Image } from './entities/image.entity';

// providers
import { Cloudinary } from './images.provider';

// interfaces
import { ICloudinaryResponse } from './interfaces/ICloudinaryResponse.interface';
import { UploadApiErrorResponse } from 'cloudinary';

// typeorm
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ImagesService {
  private v2: any;

  constructor(
    @Inject(Cloudinary)
    private readonly cloudinary: any,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {
    this.cloudinary.config({
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    });
    this.v2 = cloudinary;
  }

  async upload(
    file: Express.Multer.File,
  ): Promise<ICloudinaryResponse | UploadApiErrorResponse> {
    const validFormats = ['image/jpeg', 'image/png', 'image/webp'];

    if (!validFormats.includes(file.mimetype))
      throw new BadRequestException('File type must be jpg, png or webp image');

    return new Promise((resolve, reject) => {
      const upload = this.v2.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
      toStream(file.buffer).pipe(upload);
    });
  }

  async destroy(publicId: string) {
    const cloudDelete = await this.v2.uploader
      .destroy(publicId)
      .then((res) => res);
    return cloudDelete;
  }

  async destroyBulk(publicIds: string[]) {
    const cloudDelete = await this.v2.api
      .delete_resources(publicIds)
      .then((res) => res);
    return cloudDelete;
  }

  async create(file: Express.Multer.File) {
    const uploaded = await this.upload(file);
    const { secure_url, width, height, format, public_id } = uploaded;
    const image: CreateImageDto = {
      url: secure_url,
      width,
      height,
      format,
      public_id,
    };
    try {
      const registerUploaded = this.imageRepository.create(image);
      await this.imageRepository.save(registerUploaded);

      return registerUploaded;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 20, offset = 0 } = paginationDto;
    const images = await this.imageRepository.find({
      take: limit,
      skip: offset,
    });
    return images;
  }

  async findOne(id: number) {
    const image = await this.imageRepository.findOneBy({ id });
    return image;
  }

  async remove(id: number) {
    const toDelete = await this.findOne(id);
    if (!toDelete) throw new NotFoundException();

    const query = await this.destroy(toDelete.public_id);
    if (query.result !== 'ok') throw new NotFoundException();

    try {
      const deleted = await this.imageRepository.remove(toDelete);
      return deleted;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async removeBulk(ids: number[]) {
    // find many elements by id
    const imagesToDelete = await this.imageRepository
      .createQueryBuilder('images')
      .where('images.id IN (:...ids)', { ids })
      .getMany();

    // get images public ids
    const idsToDeleteFromCloud = [];
    imagesToDelete.forEach((image) => {
      idsToDeleteFromCloud.push(image.public_id);
    });

    // delete from cloudinary
    const cloudDeletedItems = await this.destroyBulk(idsToDeleteFromCloud);

    const deletedCloudIds = [];

    // save deleted ids in a new array
    idsToDeleteFromCloud.forEach((id) => {
      if (cloudDeletedItems.deleted[id] === 'deleted') deletedCloudIds.push(id);
    });

    // delete from db
    try {
      // images To Delete
      const imagesToDeleteFromDB = [];
      deletedCloudIds.forEach((cloudId) => {
        const image = imagesToDelete.find(
          (image) => image.public_id === cloudId,
        );
        imagesToDeleteFromDB.push(image);
      });
      const deletePromises = [];
      imagesToDeleteFromDB.forEach((image) => {
        deletePromises.push(this.imageRepository.delete(image));
      });
      const results = await Promise.all(deletePromises);
      return results;
    } catch (error) {
      throw new BadRequestException();
    }
  }
}

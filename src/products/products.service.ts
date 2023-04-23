// tools
import { isUUID } from 'class-validator';

// common
import { BadRequestException, Injectable } from '@nestjs/common';

// dto
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

//entities
import { Product } from './entities/product.entity';

// repository
import { InjectRepository } from '@nestjs/typeorm';

// typeorm
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const newProduct = createProductDto;
    try {
      const product = this.productRepository.create(newProduct);

      await this.productRepository.save(product);
      return product;
    } catch (error) {
      throw new BadRequestException('Product name or slug already exists');
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const query = await this.productRepository.find({
      take: limit,
      skip: offset,
    });
    return query;
  }

  async findOne(id: string) {
    let product: Product;

    if (isUUID(id))
      product = await this.productRepository.findOneBy({ id: id });
    else {
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder
        .where(`LOWER(name) =:name or LOWER(slug) =:slug`, {
          name: id.toLowerCase(),
          slug: id.toLowerCase(),
        })
        .getOne();
    }

    if (!product)
      throw new BadRequestException('The requested product doesnt exist');
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    if (!isUUID(id)) throw new BadRequestException('invalid product id');
    const toUpdate = updateProductDto;

    const product = await this.productRepository.preload({
      id: id,
      ...toUpdate,
    });

    if (!product)
      throw new BadRequestException('The requested product doesnt exist');

    //update with query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return this.findOne(id);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}

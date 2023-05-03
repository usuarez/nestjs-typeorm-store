import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

// dtos
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

// entities
import { Category } from './entities/category.entity';

// typeorm
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const newCategory = createCategoryDto;
    try {
      const category = this.categoryRepository.create(newCategory);

      await this.categoryRepository.save(category);

      return category;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('category already exist');
    }
  }

  async findAll() {
    const query = await this.categoryRepository.find({
      where: { isActive: true },
    });
    return query;
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) throw new BadRequestException('Category not found');

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const toUpdate = updateCategoryDto;
    const category = await this.categoryRepository.preload({
      id,
      ...toUpdate,
    });
    if (!category)
      throw new NotFoundException('The requested category doesnt exist');

    try {
      await this.categoryRepository.save(category);
      return category;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async remove(id: number) {
    const category = await this.categoryRepository.preload({
      id,
      isActive: false,
    });
    if (!category)
      throw new NotFoundException('The requested category doesnt exist');

    try {
      await this.categoryRepository.save(category);

      return category;
    } catch (error) {
      throw new BadRequestException();
    }
  }
}

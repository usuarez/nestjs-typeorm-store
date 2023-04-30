import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async create(createTagDto: CreateTagDto) {
    try {
      const newTag = createTagDto;

      this.tagRepository.create(newTag);
      await this.tagRepository.save(newTag);

      return newTag;
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  async findAll() {
    const query = await this.tagRepository.find({
      where: { isActive: true },
    });
    return query;
  }

  async findOne(id: number) {
    const tag = await this.tagRepository.findOneBy({ id });
    if (!tag) throw new NotFoundException('Tag not found');

    return tag;
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    const toUpdate = updateTagDto;
    const tag = await this.tagRepository.preload({
      id,
      ...toUpdate,
    });
    if (!tag) throw new NotFoundException('The requested tag doesnt exist');

    try {
      await this.tagRepository.save(tag);
      return tag;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async remove(id: number) {
    const tag = await this.tagRepository.preload({
      id,
      isActive: false,
    });
    if (!tag) throw new NotFoundException('The requested tag doesnt exist');
    try {
      await this.tagRepository.save(tag);
      return tag;
    } catch (error) {
      throw new BadRequestException();
    }
  }
}

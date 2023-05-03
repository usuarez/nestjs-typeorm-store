// main tools
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

// dto
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

// entities
import { Admin } from './entities/admin.entity';

// typeorm
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async create(createAdminDto: CreateAdminDto) {
    const isSetted = await this.findAdminData();
    if (isSetted.length > 0)
      throw new BadRequestException('Admin settings already set');

    try {
      const admin = await this.adminRepository.create(createAdminDto);

      await this.adminRepository.save(admin);
      return admin;
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  async findAdminData() {
    const admindb = await this.adminRepository.find();
    if (admindb.length === 0) return [];
    if (admindb.length > 1)
      throw new InternalServerErrorException('contact your sys admin');
    if (admindb.length === 1) return admindb;
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    const toUpdate = await this.adminRepository.preload({
      ...updateAdminDto,
      id,
    });

    if (!toUpdate) throw new BadRequestException();
    try {
      this.adminRepository.save(toUpdate);
      return toUpdate;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  remove() {
    return `Contact your sys admin`;
  }
}

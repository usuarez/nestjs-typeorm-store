// main tools
import { Module } from '@nestjs/common';

// services
import { AdminService } from './admin.service';

// controllers
import { AdminController } from './admin.controller';

// entities
import { Admin } from './entities/admin.entity';

// typeorm
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
  imports: [TypeOrmModule.forFeature([Admin])],
  exports: [TypeOrmModule],
})
export class AdminModule {}

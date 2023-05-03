// main tools
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

// services
import { AdminService } from './admin.service';

// dto
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

// enums
import { validRolesEnum } from 'src/auth/enums/validRoles';

// decorators
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @Auth(validRolesEnum.admin, validRolesEnum.superUser)
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Get()
  find() {
    return this.adminService.findAdminData();
  }

  @Patch(':id')
  @Auth(validRolesEnum.admin, validRolesEnum.superUser)
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  remove() {
    return this.adminService.remove();
  }
}

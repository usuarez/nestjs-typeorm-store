import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

// dtos
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

// decorators
import { Auth } from 'src/auth/decorators/auth.decorator';

// enums
import { validRolesEnum } from 'src/auth/enums/validRoles';

// services
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @Auth(validRolesEnum.admin, validRolesEnum.superUser)
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  @Get()
  findAll() {
    return this.tagsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagsService.findOne(+id);
  }

  @Patch(':id')
  @Auth(validRolesEnum.admin, validRolesEnum.superUser)
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagsService.update(+id, updateTagDto);
  }

  @Delete(':id')
  @Auth(validRolesEnum.admin, validRolesEnum.superUser)
  remove(@Param('id') id: string) {
    return this.tagsService.remove(+id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { validRolesEnum } from 'src/auth/enums/validRoles';

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

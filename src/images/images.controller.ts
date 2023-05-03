// main tools
import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';

// decorators
import { Auth } from 'src/auth/decorators/auth.decorator';

// dto
import { PaginationDto } from 'src/common/dto/pagination.dto';

// services
import { ImagesService } from './images.service';

// interceptors
import { FileInterceptor } from '@nestjs/platform-express';
import { validRolesEnum } from 'src/auth/enums/validRoles';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post()
  @Auth(validRolesEnum.admin, validRolesEnum.superUser)
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile() file: Express.Multer.File) {
    return this.imagesService.create(file);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.imagesService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imagesService.findOne(+id);
  }

  @Delete(':id')
  @Auth(validRolesEnum.admin, validRolesEnum.superUser)
  remove(@Param('id') id: string) {
    return this.imagesService.remove(+id);
  }

  @Delete('bulkDelete/:ids')
  @Auth(validRolesEnum.admin, validRolesEnum.superUser)
  removeBulk(@Param('ids') ids: string) {
    const numericIds: number[] = [];
    ids.split(',').forEach((id) => {
      numericIds.push(+id);
    });
    return this.imagesService.removeBulk(numericIds);
  }
}

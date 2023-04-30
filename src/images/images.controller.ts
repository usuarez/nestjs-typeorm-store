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

// dto
import { PaginationDto } from 'src/common/dto/pagination.dto';

// services
import { ImagesService } from './images.service';

// interceptors
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  /**
   * Endpoints created with test purposes
   * 
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.imagesService.upload(file);
  }

  @Get('destroy/:id')
  cloudDestroy(@Param('id') id: string) {
    return this.imagesService.destroy(id);
  }
  
  @Get('destroyBulk/:id')
  cloudDestroyBulk(@Param('id') id: string) {
    const ids = id.split(',');
    return this.imagesService.destroyBulk(ids);
  }
  
  */

  @Post()
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
  remove(@Param('id') id: string) {
    return this.imagesService.remove(+id);
  }
}

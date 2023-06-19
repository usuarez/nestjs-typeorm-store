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
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

// decorators
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';

// entities
import { User } from 'src/auth/entities/user.entity';

// enums
import { validRolesEnum } from 'src/auth/enums/validRoles';

// services
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Auth()
  create(@Body() createOrderDto: CreateOrderDto, @GetUser() user: User) {
    return this.ordersService.create(createOrderDto, user);
  }

  @Get('/admin')
  @Auth()
  @Auth(validRolesEnum.admin, validRolesEnum.superUser)
  adminFindAll(@GetUser() user: User) {
    return this.ordersService.adminFindAll(user);
  }

  @Get()
  @Auth()
  findAll(@GetUser() user: User) {
    return this.ordersService.findAll(user);
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.ordersService.findOne(id, user);
  }

  @Patch(':id')
  @Auth()
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @GetUser() user: User,
  ) {
    return this.ordersService.update(id, updateOrderDto, user);
  }

  @Delete(':id')
  @Auth(validRolesEnum.admin, validRolesEnum.superUser)
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.ordersService.remove(id, user);
  }
}

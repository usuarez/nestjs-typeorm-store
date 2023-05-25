// decorators
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { GetUserToken } from './decorators/get-user-token.decorator';

import { GetUser } from './decorators/get-user.decorator';
import { Auth } from './decorators/auth.decorator';

// dto
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

// entities
import { User } from './entities/user.entity';

// enums
import { validRolesEnum } from './enums/validRoles';

// services
import { AuthService } from './auth.service';
import { CreateGoogleUserDto } from './dto/create-google-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
  @Post('OAuth')
  googleAuth(@Body() googleUserDto: CreateGoogleUserDto) {
    return this.authService.authGoogleUser(googleUserDto);
  }

  @Post(':id')
  @Auth()
  update(@Body() updateUserDto: UpdateUserDto, @Param('id') id: string) {
    return this.authService.updateUser(id, updateUserDto);
  }

  @Get('refresh')
  @Auth(validRolesEnum.user)
  checkAuthStatus(@GetUser() user: User, @GetUserToken() token: string) {
    return this.authService.checkJwt(user, token);
  }
}

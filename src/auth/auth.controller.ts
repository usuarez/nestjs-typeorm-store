// guards
import { UserRoleGuard } from './guards/user-role.guard';
import { AuthGuard } from '@nestjs/passport';

// decorators
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { RoleProtected } from './decorators/role-protected.decorator';
import { GetUserToken } from './decorators/get-user-token.decorator';
import { RawHeaders } from './decorators/raw-headers.decorator';
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

  @Get('checkAuth')
  @Auth(validRolesEnum.user)
  checkAuthStatus(@GetUser() user: User, @GetUserToken() token: string) {
    return this.authService.checkJwt(user, token);
  }

  @Get('test')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    //@Req() request: Express.Request
    @GetUser() user: User,
    @RawHeaders() rawHeaders: string[],
  ) {
    return { ok: true, message: 'Private route', user, rawHeaders };
  }

  @Get('test2')
  @RoleProtected(validRolesEnum.user)
  @UseGuards(AuthGuard(), UserRoleGuard)
  testingPrivateRouteb(@GetUser() user: User) {
    return { ok: true, message: 'Private route', user };
  }

  @Get('test3')
  @Auth()
  testingPrivateRoutec(@GetUser() user: User) {
    return { ok: true, message: 'Private route', user };
  }
}

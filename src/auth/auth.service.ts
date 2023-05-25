// tools
import * as bcrypt from 'bcrypt';
import * as dayjs from 'dayjs';

// common
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

// typeorm
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// dto
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

// entities
import { User } from './entities/user.entity';

// services
import { JwtService } from '@nestjs/jwt';

// types
import { IJwtPayload } from './interfaces/jwt-payload.interface';
import { CreateGoogleUserDto } from './dto/create-google-user.dto';
import { validRolesEnum } from './enums/validRoles';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  private getJwtToken(payload: IJwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  async checkJwt(user: User, token: string) {
    const tokenData = this.jwtService.decode(token);
    const tokenStart = dayjs(tokenData['iat'] * 1000);
    const tokenEnds = dayjs(tokenData['exp'] * 1000);
    if (tokenEnds.diff(tokenStart, 'minutes') < 20) {
      return { ...user, token: this.getJwtToken({ id: user.id }) };
    }

    return { user, token };
  }

  async create(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto;
    const user = {
      ...userData,
      password: bcrypt.hashSync(password, 10),
    };

    try {
      await this.userRepository.save(user);
      this.login({ email: userData.email, password: password });
    } catch (error) {
      console.error(error);
      throw new BadRequestException();
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) delete updateUserDto.password;
    if (updateUserDto.roles) delete updateUserDto.roles;

    const update = await this.userRepository.preload({
      ...updateUserDto,
      id,
    });
    if (!update) throw new NotFoundException();
    try {
      await this.userRepository.save(update);
    } catch (error) {
      console.error(error);
      throw new BadRequestException();
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true },
    });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException('invalid credentials');
    }

    delete user.password;
    return { ...user, token: this.getJwtToken({ id: user.id }) };
  }

  async authGoogleUser(googleUser: CreateGoogleUserDto) {
    const user = await this.userRepository.findOneBy({
      email: googleUser.email,
    });

    if (!user) {
      const newUser = await this.userRepository.save({
        ...googleUser,
        password: 'default:v',
        roles: [validRolesEnum.user],
      });
      return { ...newUser, token: this.getJwtToken({ id: newUser.id }) };
    }

    delete user.password;
    return { ...user, token: this.getJwtToken({ id: user.id }) };
  }
}

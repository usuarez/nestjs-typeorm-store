// tools
import * as bcrypt from 'bcrypt';
import * as dayjs from 'dayjs';

// common
import { BadRequestException, Injectable } from '@nestjs/common';

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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const user = {
        ...userData,
        password: bcrypt.hashSync(password, 10),
      };
      await this.userRepository.save(user);
      delete user.password;

      this.login({ email: userData.email, password: password });
    } catch (error) {
      return this.printExceptionFromTryBlock(error);
    }
  }

  private getJwtToken(payload: IJwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  async login(loginUserDto: LoginUserDto) {
    try {
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
    } catch (error) {
      return this.printExceptionFromTryBlock(error);
    }
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

  private printExceptionFromTryBlock(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(`Email already exists: ${error.detail}`);

    if (error === 'Unauthorized')
      throw new BadRequestException('invalid credentials');

    if (error?.response) return error.response;
    else console.log(error);
  }
}

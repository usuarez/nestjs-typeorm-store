import {
  IsEmail,
  Matches,
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
  IsArray,
  IsPhoneNumber,
} from 'class-validator';
import { validRolesEnum } from '../enums/validRoles';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @IsString()
  @MinLength(1)
  fullName: string;

  @IsString()
  @IsOptional()
  picture: string;

  @IsString()
  @IsOptional()
  sub?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsArray()
  roles: validRolesEnum[];
}

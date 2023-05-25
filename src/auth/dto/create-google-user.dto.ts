import { IsEmail, IsString, IsUrl } from 'class-validator';

export class CreateGoogleUserDto {
  @IsString()
  fullName: string;
  @IsString()
  @IsEmail()
  email: string;
  @IsString()
  @IsUrl()
  picture: string;
  @IsString()
  sub: string;
}

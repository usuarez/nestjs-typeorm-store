import {
  IsArray,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { IAccounts } from '../interfaces/IAccounts.interface';
import { ISchedule } from '../interfaces/ISchedule.interface';

export class CreateAdminDto {
  @IsString()
  @IsPhoneNumber('VE')
  phone: string;

  @IsString()
  @MinLength(20)
  address: string;

  @IsString()
  city: string;

  @IsString()
  province: string;

  @IsString()
  country: string;

  @IsString()
  storeName: string;

  @IsArray()
  @IsOptional()
  accounts: IAccounts[];

  @IsOptional()
  schedule: ISchedule;
}

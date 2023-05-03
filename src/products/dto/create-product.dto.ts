import {
  IsIn,
  IsInt,
  IsArray,
  IsNumber,
  IsString,
  MinLength,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { IDescription } from '../interfaces/productDescription.interface';

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsIn(['men', 'women', 'kid', 'unisex'])
  gender: string;

  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  @IsOptional()
  description?: IDescription;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsInt()
  @IsOptional()
  @IsPositive()
  stock?: number;

  @IsString({ each: true })
  @IsArray()
  tags: string[];

  @IsString({ each: true })
  @IsArray()
  categories: string[];

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}

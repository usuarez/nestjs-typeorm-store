import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @IsString()
  icon?: string;
}

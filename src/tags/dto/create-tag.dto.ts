import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateTagDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}

import { IsInt, IsString } from 'class-validator';

export class CreateImageDto {
  @IsString()
  url: string;

  @IsInt()
  width: number;

  @IsInt()
  height: number;

  @IsString()
  format: string;

  @IsString()
  public_id: string;
}

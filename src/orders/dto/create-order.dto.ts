import { IsInt, IsOptional, IsPositive, IsUUID } from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  productId: string;

  @IsInt()
  @IsPositive()
  quantity: number;

  @IsOptional()
  status: string;
}

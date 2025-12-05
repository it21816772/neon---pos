import { IsArray, IsEmail, IsEnum, IsOptional, IsUUID, IsInt, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsUUID()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  MOBILE = 'MOBILE',
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @IsOptional()
  @IsEnum(PaymentMethod, {
    message: 'paymentMethod must be CASH, CARD or MOBILE',
  })
  paymentMethod?: PaymentMethod;
}


import { IsString, IsArray, ValidateNested, IsNumber, Min, IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

enum OrderStatus { PENDING = 'PENDING', PROCESSING = 'PROCESSING', SHIPPED = 'SHIPPED', DELIVERED = 'DELIVERED', CANCELLED = 'CANCELLED' }

export class OrderItemDto {
  @IsString() productId: string;
  @IsNumber() @Min(1) qty: number;
  @IsNumber() price: number;
}

export class CreateOrderDto {
  @IsArray() @ValidateNested({ each: true }) @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsString() addressName: string;
  @IsString() addressPhone: string;
  @IsString() addressStreet: string;
  @IsString() addressCity: string;
  @IsString() addressState: string;
  @IsString() addressPincode: string;

  @IsOptional() @IsString() paymentOrderId?: string;
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus) status: OrderStatus;
}

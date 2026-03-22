import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateProductDto {
  @IsString() name: string;
  @IsNumber() @Min(0) price: number;
  @IsNumber() @Min(0) mrp: number;
  @IsString() category: string;
  @IsNumber() @Min(0) stock: number;
  @IsString() image: string;
  @IsString() desc: string;
  @IsOptional() @IsString() badge?: string;
}

export class UpdateProductDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsNumber() price?: number;
  @IsOptional() @IsNumber() mrp?: number;
  @IsOptional() @IsNumber() stock?: number;
  @IsOptional() @IsString() badge?: string;
  @IsOptional() isActive?: boolean;
}

export class ProductQueryDto {
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() search?: string;
  @IsOptional() sort?: string;
  @IsOptional() priceMax?: string;
  @IsOptional() page?: string;
  @IsOptional() limit?: string;
}

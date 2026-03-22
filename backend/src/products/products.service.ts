import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './products.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: ProductQueryDto) {
    const { category, search, sort, priceMax, page = '1', limit = '12' } = query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where: any = { isActive: true };
    if (category && category !== 'All') where.category = category;
    if (search) where.name = { contains: search, mode: 'insensitive' };
    if (priceMax) where.price = { lte: parseInt(priceMax) };

    const orderBy: any =
      sort === 'Price ↑' ? { price: 'asc' } :
      sort === 'Price ↓' ? { price: 'desc' } :
      sort === 'Rating'  ? { rating: 'desc' } :
                           { reviews: 'desc' };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({ where, orderBy, skip, take: parseInt(limit) }),
      this.prisma.product.count({ where }),
    ]);

    return { products, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async create(dto: CreateProductDto) {
    return this.prisma.product.create({ data: dto });
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);
    return this.prisma.product.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.product.update({ where: { id }, data: { isActive: false } });
  }

  async getCategories() {
    const cats = await this.prisma.product.findMany({ where: { isActive: true }, select: { category: true }, distinct: ['category'] });
    return ['All', ...cats.map(c => c.category)];
  }
}

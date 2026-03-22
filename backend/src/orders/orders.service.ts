import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './orders.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateOrderDto) {
    const total = dto.items.reduce((s, i) => s + i.price * i.qty, 0);
    const order = await this.prisma.order.create({
      data: {
        userId,
        total,
        addressName: dto.addressName,
        addressPhone: dto.addressPhone,
        addressStreet: dto.addressStreet,
        addressCity: dto.addressCity,
        addressState: dto.addressState,
        addressPincode: dto.addressPincode,
        paymentOrderId: dto.paymentOrderId,
        items: {
          create: dto.items.map(i => ({ productId: i.productId, qty: i.qty, price: i.price })),
        },
      },
      include: { items: { include: { product: true } } },
    });

    // Decrement stock
    for (const item of dto.items) {
      await this.prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.qty } },
      });
    }

    return order;
  }

  async findMyOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: { select: { name: true, image: true } } } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string, role: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (role !== 'ADMIN' && order.userId !== userId) throw new ForbiddenException();
    return order;
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    return this.prisma.order.update({ where: { id }, data: { status: dto.status } });
  }

  async markPaid(paymentOrderId: string, paymentId: string) {
    return this.prisma.order.updateMany({
      where: { paymentOrderId },
      data: { status: 'PROCESSING', paymentId },
    });
  }

  // Admin: all orders
  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({ skip, take: limit, include: { user: { select: { name: true, email: true } }, items: true }, orderBy: { createdAt: 'desc' } }),
      this.prisma.order.count(),
    ]);
    return { orders, total };
  }

  async getAnalytics() {
    const [totalOrders, totalUsers, revenueAgg] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.user.count(),
      this.prisma.order.aggregate({ _sum: { total: true }, _avg: { total: true } }),
    ]);
    return {
      totalOrders,
      totalUsers,
      totalRevenue: revenueAgg._sum.total || 0,
      avgOrderValue: Math.round(revenueAgg._avg.total || 0),
    };
  }
}

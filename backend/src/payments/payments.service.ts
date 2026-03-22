import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';
import Razorpay from 'razorpay';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class PaymentsService {
  private razorpay: Razorpay;

  constructor(private config: ConfigService, private ordersService: OrdersService) {
    this.razorpay = new Razorpay({
      key_id: config.get('RAZORPAY_KEY_ID'),
      key_secret: config.get('RAZORPAY_KEY_SECRET'),
    });
  }

  async createOrder(amount: number) {
    const order = await this.razorpay.orders.create({
      amount: amount * 100, // paise
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    });
    return { orderId: order.id, amount: order.amount, currency: order.currency };
  }

  async verifyAndCapture(body: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
    const expected = createHmac('sha256', this.config.get('RAZORPAY_KEY_SECRET'))
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expected !== razorpay_signature) return { success: false };

    await this.ordersService.markPaid(razorpay_order_id, razorpay_payment_id);
    return { success: true };
  }

  async handleWebhook(rawBody: string, signature: string) {
    const expected = createHmac('sha256', this.config.get('RAZORPAY_WEBHOOK_SECRET'))
      .update(rawBody)
      .digest('hex');

    if (expected !== signature) return { received: false };

    const event = JSON.parse(rawBody);
    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      await this.ordersService.markPaid(payment.order_id, payment.id);
    }
    return { received: true };
  }
}

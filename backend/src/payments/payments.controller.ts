import { Controller, Post, Body, Headers, Req, UseGuards, RawBodyRequest } from '@nestjs/common';
import { Request } from 'express';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('create-order')
  @UseGuards(JwtAuthGuard)
  createOrder(@Body('amount') amount: number) {
    return this.paymentsService.createOrder(amount);
  }

  @Post('verify')
  @UseGuards(JwtAuthGuard)
  verify(@Body() body: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
    return this.paymentsService.verifyAndCapture(body);
  }

  @Post('webhook')
  webhook(@Req() req: RawBodyRequest<Request>, @Headers('x-razorpay-signature') sig: string) {
    return this.paymentsService.handleWebhook(req.rawBody.toString(), sig);
  }
}

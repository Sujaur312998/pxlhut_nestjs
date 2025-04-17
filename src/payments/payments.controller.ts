import { Body, Controller, Get, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly stripeService: PaymentsService) {}
  @Post('checkout')
  async checkout(@Body() body: { amount: number; currency?: string }) {
    const session = await this.stripeService.createCheckoutSession(
      body.amount,
      body.currency,
    );

    return { url: session.url };
  }

  @Get('success')
  success() {
    return {
      success: true,
      msg: 'Payment Successfull',
    };
  }
  @Get('cancle')
  cancle() {
    return {
      success: false,
      msg: 'Payment Unsuccessfull',
    };
  }
}

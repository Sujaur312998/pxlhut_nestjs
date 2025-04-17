import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/lib/guard/jwt-auth.guard';
import { User } from 'src/lib/decorators/user.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentService: PaymentsService) {}

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  async checkout(
    @Body() body: { amount: number; currency?: string; userId: string },
    @User() user: { id: string; email: string; role: string },
  ) {
    const session = await this.paymentService.createCheckoutSession(
      body.amount,
      body.currency,
      user.id,
    );

    return { url: session.url };
  }

  @Post('webhook')
  async handleStripeWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    try {
      await this.paymentService.handleWebhook(req, signature);
      return res.status(200).json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      return res.status(400).send(`Webhook Error: ${error}`);
    }
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

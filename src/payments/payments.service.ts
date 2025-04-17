/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const stripeKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      throw new Error('STRIPE_SECRET_KEY is not defined');
    }

    this.stripe = new Stripe(stripeKey, {
      apiVersion: '2025-03-31.basil',
    });
  }

  async createCheckoutSession(
    amount: number,
    currency = 'usd',
    userId: string,
  ) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: 'Test Product',
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:3000/payments/success',
      cancel_url: 'http://localhost:3000/payments/cancel',
      metadata: {
        userId: userId,
      },
    });

    return session;
  }

  async handleWebhook(req: Request, signature: string) {
    const webhookSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );

    const event = this.stripe.webhooks.constructEvent(
      req.body as Buffer,
      signature,
      webhookSecret!,
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      await this.savePaymentFromStripeSession(session);
    }
  }

  async savePaymentFromStripeSession(session: Stripe.Checkout.Session) {
    const userId = session.metadata?.userId;
    const amount = (session.amount_total ?? 0) / 100;
    console.log(session.amount_total);

    if (!userId) {
      throw new Error('Missing userId in metadata');
    }

    await this.prisma.payment.create({
      data: {
        userId,
        amount,
        currency: session.currency ?? 'USD',
        method: session.payment_method_types?.[0] ?? 'card',
        status: session.payment_status,
      },
    });
  }
}

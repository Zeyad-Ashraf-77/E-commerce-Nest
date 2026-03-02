
import Stripe from 'stripe';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StripeService {
    private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    constructor() {
    }
    createCheckOutSession = async (
        {
            lineItems,
            discount,
            costumerEmail,
            metadata,
        }: {
            lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
            discount: Stripe.Checkout.SessionCreateParams.Discount[],
            costumerEmail: string,
            metadata: Record<string, string>,
        }
    ) => {
        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: lineItems,
            discounts: discount,
            metadata,
            customer_email: costumerEmail,
            success_url: "http://localhost:3000/order/success",
            cancel_url: "http://localhost:3000/order/cancel",
        })
        return session
    }
    createCoupon = async ({percent_off}: {percent_off: number}) => {
        const coupon = await this.stripe.coupons.create({percent_off, duration:"once"})
        return coupon
    }
    createRefund = async ({paymentIntent}: {paymentIntent: string}) => {
        const refund = await this.stripe.refunds.create({payment_intent: paymentIntent,reason:"requested_by_customer"})
        return refund
    }
}
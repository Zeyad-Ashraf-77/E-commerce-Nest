import { Injectable, NotFoundException } from '@nestjs/common';
import { userRequest } from 'src/cammon/interfaces';
import { CouponRepo } from 'src/DB/repisitories/coupon.repo';
import { CreateOrderDto } from './order.dto';
import { OrderRepo } from 'src/DB/repisitories/order.repo';
import { CartRepo } from 'src/DB/repisitories/cart.repo';
import { ProductRepo } from 'src/DB/repisitories/product.repo';
import { paymentMethodEnum, status } from 'src/cammon/enume';
import { Types } from 'mongoose';
import { StripeService } from 'src/cammon/service/stripe/stripe.service';

@Injectable()
export class OrderService {
    constructor(
        private readonly couponRepo: CouponRepo,
        private readonly orderRepo: OrderRepo,
        private readonly cartRepo: CartRepo,
        private readonly productRepo: ProductRepo,
        private readonly stripeService: StripeService,
    ) { }
    async createorder(orderDto: CreateOrderDto, req: userRequest) {
        const { couponCode, paymentMethod, address, phone } = orderDto
        let coupon: any = ""
        if (couponCode) {
            coupon = await this.couponRepo.findOne({ code: couponCode })
            if (!coupon) {
                throw new NotFoundException("Coupon not found")
            }
        }
        const cart = await this.cartRepo.findOne({ createdBy: req.user._id })
        if (!cart || cart.products.length == 0) {
            throw new NotFoundException("Cart not found")
        }
        for (const product of cart.products) {
            console.log(product)
            const productData = await this.productRepo.findOne({ _id: product.product, stock: { $gte: product.quantity } })
            if (!productData) {
                throw new NotFoundException("Product not found")
            }
        }
        const supTotal = cart.supTotal || cart.products.reduce((acc, product) => acc + (product.price || 0), 0)
        const order = await this.orderRepo.create({
            userId: req.user._id,
            cart: cart._id,
            totalPrice: couponCode ? supTotal - ((supTotal * coupon.amount) / 100) : supTotal,
            paymentMethod,
            address,
            phone,
            status: paymentMethod == paymentMethodEnum.cash ? status.placed : status.pending,
            coupon: couponCode ? coupon._id : undefined,
        })
        for (const product of cart.products) {
            await this.productRepo.findOneAndUpdate({ _id: product.product }, { $inc: { stock: -product.quantity } }, { new: true })
        }

        if (couponCode) {
            await this.couponRepo.findOneAndUpdate({ code: couponCode }, { $push: { usedBy: req.user._id } }, { new: true })
        }
        if (paymentMethod == paymentMethodEnum.cash) {
            await this.cartRepo.findOneAndUpdate({ createdBy: req.user._id }, { products: [] }, { new: true })
        }

        return order
    }
    async paymentWithStripe(id: Types.ObjectId, req: userRequest) {
        const order = await this.orderRepo.findOneAndPopulate({ _id: id, status: status.pending }, [{
            path: "cart",
            populate: {
                path: "products.product",
            },
        }, {
            path: "coupon",
        }])
        if (!order) {
            throw new NotFoundException("Order not found")
        }
        let coupon: any = ""
        if (order.coupon) {
            coupon = await this.stripeService.createCoupon({ percent_off: order.coupon.amount })
        }
        const { url } = await this.stripeService.createCheckOutSession({

            lineItems: order.cart.products.map((product) => ({
                price_data: {
                    currency: "egp",
                    product_data: {
                        name: product.product.name,
                    },
                    unit_amount: (product.product.price * 100),
                },
                quantity: product.quantity,
            })),
            discount: coupon ? [{ coupon: coupon.id }] : [],
            costumerEmail: req.user.email,
            metadata: {
                orderId: order._id.toString(),
            },
        })
        return { url }
    }
    async webhook(body: any) {
        const orderId = body.data.object.metadata.orderId
        const order = await this.orderRepo.findOneAndUpdate({ _id: orderId }, {
            status: status.paid,
            orderChanges: {
                paidAt: new Date()
            },
            paymentIntent: body.data.object.payment_intent
        }, { new: true })
        return order
    }
    async refunderOrder(id: Types.ObjectId, req: userRequest) {
        const order = await this.orderRepo.findOneAndUpdate({ _id: id, status: { $in: [status.pending, status.placed] } }, {
            status: status.canceld,
            orderChanges: {
                canceldAt: new Date(),
                cancelledBy: req.user._id
            },
        }, { new: true })
        if (order.paymentIntent == paymentMethodEnum.card) {
            await this.stripeService.createRefund({paymentIntent: order.paymentIntent})
        }
         await this.orderRepo.findOneAndUpdate({ _id: id}, {
            status: status.refunded,
            orderChanges: {
                refundedAt: new Date(),
                refunderBy: req.user._id
            }
        }, { new: true })
        return order
    }
}
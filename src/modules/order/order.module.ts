
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { ProductModule } from '../product/product.module';
import { Coupon, CouponSchema } from 'src/DB/model/coupon.model';
import { Order, OrderSchema } from 'src/DB/model/order.model';
import { Cart, CartSchema } from 'src/DB/model/cart.model';
import { Product, ProductSchema } from 'src/DB/model/product.model';
import { OrderRepo } from 'src/DB/repisitories/order.repo';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CouponRepo } from 'src/DB/repisitories/coupon.repo';
import { ProductRepo } from 'src/DB/repisitories/product.repo';
import { CartRepo } from 'src/DB/repisitories/cart.repo';
import { CartModule } from '../cart/cart.module';
import { couponModule } from '../coupon/coupon.module';
import { StripeService } from 'src/cammon/service/stripe/stripe.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Coupon.name, schema: CouponSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Cart.name, schema: CartSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
    UserModule,
    forwardRef(() => ProductModule),
    forwardRef(() => CartModule),
    forwardRef(() => couponModule),
  ],
  controllers: [OrderController],
  providers: [
    CouponRepo,
    OrderService,
    OrderRepo,
    CartRepo,
    ProductRepo,
    StripeService
  ],
  exports: [
    OrderRepo
  ],
})
export class OrderModule { }

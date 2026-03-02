import { Module } from '@nestjs/common';
import {  MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartRepo } from 'src/DB/repisitories/cart.repo';
import { ProductRepo } from 'src/DB/repisitories/product.repo';
import { Cart, CartSchema } from 'src/DB/model/cart.model';
import { Product, ProductSchema } from 'src/DB/model';
import { ProductModule } from '../product/product.module';
import { socketGateway } from '../gateway/socket.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cart.name, schema: CartSchema }
    ]),
    UserModule,
    ProductModule,
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema }
    ]),
    
  ],
  controllers: [CartController],
  providers: [CartService, CartRepo,ProductRepo,socketGateway ]
})
export class CartModule { }
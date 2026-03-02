import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import {  S3Service } from './cammon/service/s3.config/s3.service';
import { BrandModule } from './modules/brand/brand.module';
import { categoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { SubCategoryModule } from './modules/subCategory/subCategory.module';
import { CartModule } from './modules/cart/cart.module';
import { couponModule } from './modules/coupon/coupon.module';
import { OrderModule } from './modules/order/order.module';
import { GatewayModule } from './modules/gateway/gateway.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './config/.env',
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 60 * 60 * 1000, // 1 hour
    }),
    MongooseModule.forRoot(process.env.MONGO_URI as string),
    UserModule,
    BrandModule,
    categoryModule,
    SubCategoryModule,
    ProductModule,
    CartModule,
    couponModule,
    OrderModule,
    GatewayModule,
  ],
  controllers: [AppController],
  providers: [AppService, S3Service],
})
export class AppModule {}

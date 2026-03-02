
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Brand, BrandSchema } from 'src/DB/model/brand.model';
import { BrandRepo } from 'src/DB/repisitories/brand.repo';
import { UserModule } from '../user/user.module';
import { S3Service } from 'src/cammon/service/s3.config/s3.service';
import { ProductModule } from '../product/product.module';
import { categoryModule } from '../category/category.module';
import { SubCategoryModule } from '../subCategory/subCategory.module';
import { couponController } from './coupon.controller';
import { couponService } from './coupon.service';
import { CouponRepo } from 'src/DB/repisitories/coupon.repo';
import { Coupon, CouponSchema } from 'src/DB/model/coupon.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Coupon.name, schema: CouponSchema },
    ]),
    UserModule,
    forwardRef(() => categoryModule),
    forwardRef(() => SubCategoryModule),
    forwardRef(() => ProductModule),
  ],
  controllers: [couponController],
  providers: [
    couponService,
    CouponRepo,
    S3Service,
  ],
  exports: [
    CouponRepo
  ],
})
export class couponModule { }

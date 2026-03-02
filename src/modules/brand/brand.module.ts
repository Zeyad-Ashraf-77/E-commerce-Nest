
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Brand, BrandSchema } from 'src/DB/model/brand.model';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { BrandRepo } from 'src/DB/repisitories/brand.repo';
import { UserModule } from '../user/user.module';
import { S3Service } from 'src/cammon/service/s3.config/s3.service';

import { ProductModule } from '../product/product.module';
import { categoryModule } from '../category/category.module';
import { SubCategoryModule } from '../subCategory/subCategory.module';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Brand.name, schema: BrandSchema },
    ]),
    UserModule,
    forwardRef(() => categoryModule),
    forwardRef(() => SubCategoryModule),
    forwardRef(() => ProductModule),
  ],
  controllers: [BrandController],
  providers: [
    BrandService,
    BrandRepo,
    S3Service,
    {provide:CACHE_MANAGER,useValue:CACHE_MANAGER}
  ],
  exports: [
    BrandRepo, // 🔥 مهم
  ],
})
export class BrandModule {}

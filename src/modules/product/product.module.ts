import { forwardRef, Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/DB/model/product.model';
import { ProductRepo } from 'src/DB/repisitories/product.repo';
import { UserModule } from '../user/user.module';
import { S3Service } from 'src/cammon/service/s3.config/s3.service';
import { BrandModule } from '../brand/brand.module';
import { categoryModule } from '../category/category.module';
import { SubCategoryModule } from '../subCategory/subCategory.module';
import { UserRepo } from 'src/DB/repisitories/user.repo';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema }
    ]),
    UserModule,
    forwardRef(() => BrandModule),
    forwardRef(() => categoryModule),
    forwardRef(() => SubCategoryModule)
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductRepo,S3Service,UserRepo]
})
export class ProductModule { }
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { category, categorySchema } from 'src/DB/model/category.model';
import { categoryRepo } from 'src/DB/repisitories/category.repo';
import { UserModule } from '../user/user.module';
import { S3Service } from 'src/cammon/service/s3.config/s3.service';
import { categoryController } from './category.controller';
import { categoryService } from './category.service';
import { BrandModule } from '../brand/brand.module';
import { SubCategoryModule } from '../subCategory/subCategory.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: category.name, schema: categorySchema },
    ]),
    UserModule,
    forwardRef(() => BrandModule),
    forwardRef(() => SubCategoryModule),
    forwardRef(() => ProductModule),
  ],
  controllers: [categoryController],
  providers: [
    categoryService,
    categoryRepo,
    S3Service,
  ],
  exports: [
    categoryService,
    categoryRepo,
  ],
})
export class categoryModule {}

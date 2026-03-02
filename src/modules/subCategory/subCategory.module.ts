import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { subCategory, subCategorySchema } from 'src/DB/model/subCategory.model';
import { subCategoryRepo } from 'src/DB/repisitories/subCategory.repo';
import { S3Service } from 'src/cammon/service/s3.config/s3.service';
import { subCategoryController } from './subCategory.controller';
import { BrandModule } from '../brand/brand.module';
import { categoryModule } from '../category/category.module';
import { TokenService } from 'src/cammon/service/Token';
import { JwtService } from '@nestjs/jwt';
import { UserRepo } from 'src/DB/repisitories/user.repo';
import { UserModule } from '../user/user.module';
import { SubCategoryService } from './subCategory.service';
import { categoryRepo } from 'src/DB/repisitories/category.repo';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: subCategory.name, schema: subCategorySchema },
    ]),
    forwardRef(() => BrandModule),
    forwardRef(() => categoryModule),
    forwardRef(() => UserModule),
  ],
  controllers: [subCategoryController],
  providers: [
    SubCategoryService,
    subCategoryRepo,
    S3Service,
    TokenService,
    JwtService,
    UserRepo,
    ],
  exports: [
    subCategoryRepo,
  ],
})
export class SubCategoryModule {}

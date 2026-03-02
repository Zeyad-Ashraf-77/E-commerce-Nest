import { Body, Controller, Param, ParseFilePipe, Patch, Post, Req, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { CreateProductDto, paramDto, UpdateProductDto } from './product.dto';
import type { userRequest } from 'src/cammon/interfaces';
import { Auth } from 'src/cammon/decretors';
import { UserRole } from 'src/cammon/enume';
import { TokenType } from 'src/cammon/enume';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { filevalidation, multerCloud } from 'src/cammon/utils/multer';
import { ProductService } from './product.service';
@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) { }
    @Auth(TokenType.access, [UserRole.ADMIN])
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'mainImage', maxCount: 1 },
        { name: 'subImages', maxCount: 5 }
    ], multerCloud({ fileType: filevalidation.image })))
    @Post()
    async createProduct(
        @Body() productDto: CreateProductDto,
        @Req() req: userRequest,
        @UploadedFiles(ParseFilePipe) files:{mainImage:Express.Multer.File[],subImages:Express.Multer.File[]}) {
        const product = await this.productService.createProduct(productDto, req, files);
        return { message: "successfully", product };
    }
     @Auth(TokenType.access, [UserRole.ADMIN])
    @Patch(':id')
    async updateProduct(
        @Param() {id} :paramDto,
        @Body() productDto: UpdateProductDto,
        @Req() req: userRequest,
      ) {
        const product = await this.productService.updateProduct(productDto, req, id);
        return { message: "successfully", product };
    }

    @Auth(TokenType.access, [UserRole.ADMIN,UserRole.USER])
    @Post('wishlist/:id')
    async addToWishlist(@Req() req: userRequest, @Param() { id }: paramDto) {
        const userExist = await this.productService.addToWishlist(req, id);
        return { message: "successfully",  user: userExist };
    }
}

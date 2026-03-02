import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { BrandRepo } from 'src/DB/repisitories/brand.repo';
import { CreateProductDto, paramDto, UpdateProductDto } from './product.dto';
import { userRequest } from 'src/cammon/interfaces';
import { S3Service } from 'src/cammon/service/s3.config/s3.service';
import { subCategoryRepo } from 'src/DB/repisitories/subCategory.repo';
import { categoryRepo } from 'src/DB/repisitories/category.repo';
import { ProductRepo } from 'src/DB/repisitories/product.repo';
import { Types } from 'mongoose';
import { UserRepo } from 'src/DB/repisitories/user.repo';

@Injectable()
export class ProductService {
    constructor(
        private readonly brandRepo: BrandRepo,
        private readonly categoryRepo: categoryRepo,
        private readonly subCategoryRepo: subCategoryRepo,
        private readonly productRepo: ProductRepo,
        private readonly s3Service: S3Service,
        private readonly userRepo: UserRepo
    ) { }

    // ======================================Create Product======================================
    async createProduct(productDto: CreateProductDto, req: userRequest, file: { mainImage: Express.Multer.File[], subImages: Express.Multer.File[] }) {
        let { name, discraption, quantity, price, discount, stock, brand, category, subCategory } = productDto
        const brandExist = await this.brandRepo.findOne({ _id: brand })
        if (!brandExist) {
            throw new BadRequestException('brand not found')
        }
        const categoryExist = await this.categoryRepo.findOne({ _id: category })
        if (!categoryExist) {
            throw new BadRequestException('category not found')
        }
        const subCategoryExist = await this.subCategoryRepo.findOne({ _id: subCategory })
        if (!subCategoryExist) {
            throw new BadRequestException('subCategory not found')
        }
        const productExist = await this.productRepo.findOne({ name })
        if (productExist) {
            throw new BadRequestException('product already exists')
        }
        if (stock < quantity) {
            throw new BadRequestException('stock should be greater than quantity')
        }
        price = price - (price * ((discount || 0) / 100))
        const mainImage = await this.s3Service.uploadFile({
            file: file.mainImage[0],
            path: `categorys/${categoryExist.folderAsetId}/product/mainImage`
        })
        const subImages = await this.s3Service.uploadFiles({
            files: file.subImages || [],
            path: `categorys/${categoryExist.folderAsetId}/product/subImages`
        })
        const product = await this.productRepo.create({
            name,
            discraption,
            quantity,
            price,
            discount,
            stock,
            brand,
            category,
            subCategory,
            mainImage,
            subImages,
            createdBy: req.user._id
        })
        if (!product) {
            await this.s3Service.deleteFile({
                Key: mainImage,
                Bucket: process.env.BUCKET_NAME
            })
            await this.s3Service.deleteFiles({
                keysToDelete: subImages,
                Bucket: process.env.BUCKET_NAME
            })
            throw new InternalServerErrorException('product not created')
        }
        return product
    }

    // ======================================Update Product======================================
    async updateProduct(
        productDto: UpdateProductDto,
        req: userRequest,
        id:Types.ObjectId   
    ) {
        let { name, discraption, quantity, price, discount, stock, brand, category, subCategory } = productDto
        let productExist = await this.productRepo.findById(id)
        if (!productExist) {
            throw new BadRequestException('product not found')
        }
        if (category) {
            const categoryExist = await this.categoryRepo.findOne({ _id: category })
            if (!categoryExist) {
                throw new BadRequestException('category not found')
            }
        }
        if (subCategory) {
            const subCategoryExist = await this.subCategoryRepo.findOne({ _id: subCategory })
            if (!subCategoryExist) {
                throw new BadRequestException('subCategory not found')
            }
        }
        if (brand) {
            const brandExist = await this.brandRepo.findOne({ _id: brand })
            if (!brandExist) {
                throw new BadRequestException('brand not found')
            }
        }
        if (price && discount) {
            price = price - (price * (discount / 100))
        } else if (price) {
            price = price - (price * (productExist.discount / 100))
        } else if (discount) {
            price = productExist.price - (productExist.price * (discount / 100))
        }
        if (stock) {
            if (stock < productExist.quantity) {
                throw new BadRequestException('stock should be greater than quantity')
            }
        }
        productExist = await this.productRepo.findOneAndUpdate({ _id: id }, { $set: { name, discraption, quantity, price, discount, stock, brand, category, subCategory } })

        return productExist
    }

    // ======================================Add To Wishlist======================================
    async addToWishlist(req: userRequest, id: Types.ObjectId) {
        const productExist = await this.productRepo.findById(id)
        if (!productExist) {
            throw new BadRequestException('product not found')
        }
        let userExist = await this.userRepo.findOneAndUpdate({ _id: req.user._id,wishlist:{$in:id} }, { $pull: { wishlist: id } })
        if (!userExist) {
          userExist = await this.userRepo.findOneAndUpdate({ _id: req.user._id }, { $push: { wishlist: id } })
        }
        return userExist
    }
}
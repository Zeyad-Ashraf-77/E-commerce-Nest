import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { categoryRepo } from 'src/DB/repisitories/category.repo';
import { CreatecategoryDto, queryDto, UpdatecategoryDto } from './category.dto';
import { userRequest } from 'src/cammon/interfaces';
import { S3Service } from 'src/cammon/service/s3.config/s3.service';
import { Types } from 'mongoose';
import { randomUUID } from 'crypto';
import { BrandRepo } from 'src/DB/repisitories/brand.repo';

@Injectable()
export class categoryService {
    constructor(
        private readonly categoryRepo: categoryRepo,
        private readonly s3Service: S3Service,
        private readonly brandRepo: BrandRepo
    ) { }


    async createcategory(categoryDto: CreatecategoryDto, req: userRequest, file: Express.Multer.File) {
        const { name, slogan, brands } = categoryDto
        const category = await this.categoryRepo.findOne({ name })
        if (category) {
            throw new ConflictException('category name already exist')
        }

        const strictBrands = [...new Set(brands)]
        if (brands && (await this.brandRepo.find({ _id: { $in: strictBrands } })).length != strictBrands.length) {
            throw new NotFoundException('brand not found')
        }
        const folderAsetId = randomUUID()
        const url = await this.s3Service.uploadFile({
            file,
            path: `categorys/${folderAsetId}`
        })
        const categoryCreated = await this.categoryRepo.create({ name, slogan, image: url, createdBy: req.user._id, folderAsetId, brands: strictBrands })
        if (!categoryCreated) {
            await this.s3Service.deleteFile({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: url
            })
            throw new InternalServerErrorException('category not created')
        }
        return categoryCreated
    }


    async updatecategoryImage(id: Types.ObjectId, file: Express.Multer.File, req: userRequest) {
        if (!file) {
            throw new NotFoundException('category data is required')
        }
        const category = await this.categoryRepo.findOne({ _id: id, createdBy: req.user._id })
        if (!category) {
            throw new NotFoundException('category not found')
        }
        const url = await this.s3Service.uploadFile({
            file,
            path:`categorys/${category.folderAsetId}`
        })
        const categoryUpdated = await this.categoryRepo.findOneAndUpdate({ _id: id }, { image: url })
        if (!categoryUpdated) {
            await this.s3Service.deleteFile({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: url
            })
            throw new InternalServerErrorException('category not updated')
        }
        await this.s3Service.deleteFile({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: category.image
        })

        return categoryUpdated
    }


    async updatecategory(id: Types.ObjectId, categoryDto: UpdatecategoryDto, req: userRequest) {
        if (!categoryDto) {
            throw new NotFoundException('category data is required')
        }
        const { name, slogan, brands } = categoryDto
        const category = await this.categoryRepo.findOne({ _id: id, createdBy: req.user._id })
        if (!category) {
            throw new NotFoundException('category not found')
        }
        if (name && await this.categoryRepo.findOne({ name, createdBy: req.user._id })) {
            throw new ConflictException('category name already exist')
        }
        const strictBrands = [...new Set(brands)]
        if (brands && (await this.brandRepo.find({ _id: { $in: strictBrands } })).length != strictBrands.length) {
            throw new NotFoundException('brand not found')
        }
        const categoryUpdated = await this.categoryRepo.findOneAndUpdate({ _id: id, createdBy: req.user._id }, { name, slogan,brands:strictBrands })

        return categoryUpdated
    }


    async freazecategory(id: Types.ObjectId, req: userRequest) {
        const category = await this.categoryRepo.findOneAndUpdate(
            { _id: id, deletedAt: { $exists: false } },
            { deletedAt: new Date(), deletedBy: req.user._id },
            { new: true }
        )
        if (!category) {
            throw new NotFoundException('category not found')
        }

        return category
    }


    async restorecategory(id: Types.ObjectId, req: userRequest) {
        const category = await this.categoryRepo.findOneAndUpdate(
            { _id: id, deletedAt: { $exists: true } },
            { $unset: { deletedAt: '', deletedBy: '' }, restoredAt: new Date(), restoredBy: req.user._id },
            { new: true }
        )
        if (!category) {
            throw new NotFoundException('category not found ')
        }

        return category
    }


    async deletecategory(id: Types.ObjectId) {
        const category = await this.categoryRepo.findOneAndDelete(
            { _id: id, deletedAt: { $exists: true } },
        )
        if (!category) {
            throw new NotFoundException('category not found ')
        }
        await this.s3Service.deleteFile({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: category.image
        })

        return category
    }


    async getAllcategories(queryDto: queryDto) {
        const { page = 1, limit = 10, search } = queryDto
        const { data, count } = await this.categoryRepo.paginate({ ...(search ? { $or: [{ name: { $regex: search, $options: 'i' } }, { slogan: { $regex: search, $options: 'i' } }] } : { deletedAt: { $exists: false } }) }, { page, limit })
        return { data, count }
    }
}
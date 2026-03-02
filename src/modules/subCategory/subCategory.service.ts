import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { subCategoryRepo } from 'src/DB/repisitories/subCategory.repo';
import { CreateSubCategoryDto, queryDto, UpdateSubCategoryDto } from './subCategory.dto';
import { userRequest } from 'src/cammon/interfaces';
import { S3Service } from 'src/cammon/service/s3.config/s3.service';
import { Types } from 'mongoose';
import { randomUUID } from 'crypto';
import { categoryRepo } from 'src/DB/repisitories/category.repo';

@Injectable()
export class SubCategoryService {
    constructor(
        private readonly subCategoryRepo: subCategoryRepo,
        private readonly s3Service: S3Service,
        private readonly categoryRepo: categoryRepo,
    ) { }


    async createSubCategory(subCategoryDto: CreateSubCategoryDto, req: userRequest, file: Express.Multer.File) {
        const { name, category } = subCategoryDto
        const subCategory = await this.subCategoryRepo.findOne({ name })
        if (subCategory) {
            throw new ConflictException('subCategory name already exist')
        }

        const strictCategory = [...new Set(category)]
        if (category && (await this.categoryRepo.find({ _id: { $in: strictCategory } })).length != strictCategory.length) {
            throw new NotFoundException('category not found')
        }
        const folderAsetId = randomUUID()
        const url = await this.s3Service.uploadFile({
            file,
            path: `categorys/${folderAsetId}`
        })
        const subCategoryCreated = await this.subCategoryRepo.create({ name,  image: url, createdBy: req.user._id, folderAsetId, category: strictCategory })
        if (!subCategoryCreated) {
            await this.s3Service.deleteFile({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: url
            })
            throw new InternalServerErrorException('category not created')
        }
        return subCategoryCreated
    }


    async updateSubCategoryImage(id: Types.ObjectId, file: Express.Multer.File, req: userRequest) {
        if (!file) {
            throw new NotFoundException('category data is required')
        }
        const subCategory = await this.subCategoryRepo.findOne({ _id: id, createdBy: req.user._id })
        if (!subCategory) {
            throw new NotFoundException('subCategory not found')
        }
        const url = await this.s3Service.uploadFile({
            file,
            path:`categorys/${subCategory.folderAsetId}`
        })
        const subCategoryUpdated = await this.subCategoryRepo.findOneAndUpdate({ _id: id }, { image: url })
        if (!subCategoryUpdated) {
            await this.s3Service.deleteFile({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: url
            })
            throw new InternalServerErrorException('subCategory not updated')
        }
        await this.s3Service.deleteFile({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: subCategory.image
        })

        return subCategoryUpdated
    }


    async updateSubCategory(id: Types.ObjectId, subCategoryDto: UpdateSubCategoryDto, req: userRequest) {
        if (!subCategoryDto) {
            throw new NotFoundException('subCategory data is required')
        }
        const { name, category } = subCategoryDto
        const subCategory = await this.subCategoryRepo.findOne({ _id: id, createdBy: req.user._id })
        if (!subCategory) {
            throw new NotFoundException('subCategory not found')
        }
        if (name && await this.subCategoryRepo.findOne({ name, createdBy: req.user._id })) {
            throw new ConflictException('subCategory name already exist')
        }
        const strictCategory = [...new Set(category)]
        if (category && (await this.categoryRepo.find({ _id: { $in: strictCategory } })).length != strictCategory.length) {
            throw new NotFoundException('category not found')
        }
        const subCategoryUpdated = await this.subCategoryRepo.findOneAndUpdate({ _id: id, createdBy: req.user._id }, { name,category:strictCategory })

        return subCategoryUpdated
    }


    async freazeSubCategory(id: Types.ObjectId, req: userRequest) {
        const subCategory = await this.subCategoryRepo.findOneAndUpdate(
            { _id: id, deletedAt: { $exists: false } },
            { deletedAt: new Date(), deletedBy: req.user._id },
            { new: true }
        )
        if (!subCategory) {
            throw new NotFoundException('subCategory not found')
        }

        return subCategory
    }


    async restoreSubCategory(id: Types.ObjectId, req: userRequest) {
        const subCategory = await this.subCategoryRepo.findOneAndUpdate(
            { _id: id, deletedAt: { $exists: true } },
            { $unset: { deletedAt: '', deletedBy: '' }, restoredAt: new Date(), restoredBy: req.user._id },
            { new: true }
        )
        if (!subCategory) {
            throw new NotFoundException('subCategory not found ')
        }

        return subCategory
    }


    async deleteSubCategory(id: Types.ObjectId) {
        const subCategory = await this.subCategoryRepo.findOneAndDelete(
            { _id: id, deletedAt: { $exists: true } },
        )
        if (!subCategory) {
            throw new NotFoundException('subCategory not found ')
        }
        await this.s3Service.deleteFile({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: subCategory.image
        })

        return subCategory
    }


    async getAllSubCategories(queryDto: queryDto) {
        const { page = 1, limit = 10, search } = queryDto
        const { data, count } = await this.subCategoryRepo.paginate({ ...(search ? { $or: [{ name: { $regex: search, $options: 'i' } }, { slogan: { $regex: search, $options: 'i' } }] } : { deletedAt: { $exists: false } }) }, { page, limit })
        return { data, count }
    }
}
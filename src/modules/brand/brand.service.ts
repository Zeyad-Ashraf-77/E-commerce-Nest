import { ConflictException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { BrandRepo } from 'src/DB/repisitories/brand.repo';
import { CreateBrandDto, queryDto, UpdateBrandDto } from './brand.dto';
import { userRequest } from 'src/cammon/interfaces';
import { S3Service } from 'src/cammon/service/s3.config/s3.service';
import { Types } from 'mongoose';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class BrandService {
    constructor(
        private readonly brandRepo: BrandRepo,
        private readonly s3Service: S3Service,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }
    async createBrand(brandDto: CreateBrandDto, req: userRequest, file: Express.Multer.File) {
        const { name, slogan } = brandDto
        const brans = await this.brandRepo.findOne({ name })
        if (brans) {
            throw new ConflictException('brand name already exist')
        }
        const url = await this.s3Service.uploadFile({
            file,
            path: 'brands'
        })
        const brand = await this.brandRepo.create({ name, slogan, image: url, createdBy: req.user._id })
        if (!brand) {
            await this.s3Service.deleteFile({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: url
            })
            throw new InternalServerErrorException('brand not created')
        }
        return brand
    }
    async updateBrandImage(id: Types.ObjectId, file: Express.Multer.File, req: userRequest) {
        if (!file) {
            throw new NotFoundException('brand data is required')
        }
        const brand = await this.brandRepo.findOne({ _id: id, createdBy: req.user._id })
        if (!brand) {
            throw new NotFoundException('brand not found')
        }
        const url = await this.s3Service.uploadFile({
            file,
            path: 'brands'
        })
        const brandUpdated = await this.brandRepo.findOneAndUpdate({ _id: id }, { image: url })
        if (!brandUpdated) {
            await this.s3Service.deleteFile({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: url
            })
            throw new InternalServerErrorException('brand not updated')
        }
        await this.s3Service.deleteFile({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: brand.image
        })

        return brandUpdated
    }
    async updateBrand(id: Types.ObjectId, brandDto: UpdateBrandDto, req: userRequest) {
        if (!brandDto) {
            throw new NotFoundException('brand data is required')
        }
        const { name, slogan } = brandDto
        const brand = await this.brandRepo.findOne({ _id: id, createdBy: req.user._id })
        if (!brand) {
            throw new NotFoundException('brand not found')
        }
        if (name && await this.brandRepo.findOne({ name, createdBy: req.user._id })) {
            throw new ConflictException('brand name already exist')
        }
        const brandUpdated = await this.brandRepo.findOneAndUpdate({ _id: id, createdBy: req.user._id }, { name, slogan })

        return brandUpdated
    }
    async freazeBrand(id: Types.ObjectId, req: userRequest) {
        const brand = await this.brandRepo.findOneAndUpdate(
            { _id: id, deletedAt: { $exists: false } },
            { deletedAt: new Date(), deletedBy: req.user._id },
            { new: true }
        )
        if (!brand) {
            throw new NotFoundException('brand not found')
        }

        return brand
    }
    async restoreBrand(id: Types.ObjectId, req: userRequest) {
        const brand = await this.brandRepo.findOneAndUpdate(
            { _id: id, deletedAt: { $exists: true } },
            { $unset: { deletedAt: '', deletedBy: '' }, restoredAt: new Date(), restoredBy: req.user._id },
            { new: true }
        )
        if (!brand) {
            throw new NotFoundException('brand not found ')
        }

        return brand
    }
    async deleteBrand(id: Types.ObjectId) {
        const brand = await this.brandRepo.findOneAndDelete(
            { _id: id, deletedAt: { $exists: true } },
        )
        if (!brand) {
            throw new NotFoundException('brand not found ')
        }
        await this.s3Service.deleteFile({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: brand.image
        })

        return brand
    }
    async getAllBrands(queryDto: queryDto) {
        const { page = 1, limit = 10, search } = queryDto
        const { data, count } = await this.brandRepo.paginate({ ...(search ? { $or: [{ name: { $regex: search, $options: 'i' } }, { slogan: { $regex: search, $options: 'i' } }] } : { deletedAt: { $exists: false } }) }, { page, limit })
        return { data, count }
    }
}
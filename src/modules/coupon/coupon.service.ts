import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { userRequest } from 'src/cammon/interfaces';
import { CouponRepo } from 'src/DB/repisitories/coupon.repo';
import { CreateCouponDto } from './coupon.dto';

@Injectable()
export class couponService {
    constructor(
        private readonly couponRepo: CouponRepo
    ) { }
    async createcoupon(couponDto: CreateCouponDto, req: userRequest) {
        const { code, amount, fromDate, toDate } = couponDto
        const iscodeExist=await this.couponRepo.findOne({code:code.toLowerCase()})
        if(iscodeExist){
            throw new ConflictException("code already exist")
        }
        const coupon = await this.couponRepo.create({
            code,
            amount,
            fromDate,
            toDate,
            createdBy: req.user._id
        })
        return coupon
    }
}
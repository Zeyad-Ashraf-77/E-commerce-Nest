import { Body, Controller, Delete, Get, Param, ParseFilePipe, Patch, Post, Query, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { couponService } from './coupon.service';
import { CreateCouponDto } from './coupon.dto';
import type { userRequest } from 'src/cammon/interfaces';
import { Auth } from 'src/cammon/decretors';
import { UserRole } from 'src/cammon/enume';
import { TokenType } from 'src/cammon/enume';
@Controller('coupons')
export class couponController {
    constructor(private readonly couponService: couponService) { }
    @Auth(TokenType.access, [UserRole.ADMIN])
    @Post()
    async createcoupon(
        @Body() couponDto: CreateCouponDto,
        @Req() req: userRequest) {
        const coupon = await this.couponService.createcoupon(couponDto, req);
        return { message: "successfully", coupon };
    }

}

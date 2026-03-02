import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Max, MaxLength, Min, MinLength, Validate } from "class-validator";
import { CouponValidator } from "src/cammon/decretors/couponCostum.decroter";


export class CreateOrderDto {
    @IsString()
    @MinLength(3)
    @MaxLength(30)
    @IsOptional()
    couponCode?: string
    @IsString()
    @IsNotEmpty()
    paymentMethod: string
    @IsString()
    @IsNotEmpty()
    address: string
    @IsString()
    @IsNotEmpty()
    phone: string
}

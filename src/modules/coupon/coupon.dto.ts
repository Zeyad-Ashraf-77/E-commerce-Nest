import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsPositive, IsString, Max, MaxLength, Min, MinLength, Validate } from "class-validator";
import { CouponValidator } from "src/cammon/decretors/couponCostum.decroter";


export class CreateCouponDto {
    @IsString()
    @MinLength(3)
    @MaxLength(30)
    @IsNotEmpty()
    code: string
    @IsNumber()
    @Min(1)
    @Max(100)
    @IsNotEmpty()
    @IsPositive()
    amount: number

    @IsDate()
    @Type(() => Date)
    @IsNotEmpty()
    @Validate(CouponValidator)
    fromDate: Date
    @IsDate()
    @Type(() => Date)
    @IsNotEmpty()
    toDate: Date
}

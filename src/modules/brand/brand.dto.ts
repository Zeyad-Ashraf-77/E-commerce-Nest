import { Type } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { Types } from "mongoose";
import { PartialType } from "@nestjs/mapped-types";
import { AtLeastOne } from "src/cammon/decretors/brandCostum.decorator";


export class CreateBrandDto {
    @IsString()
    @MinLength(3)
    @MaxLength(30)
    @IsNotEmpty()
    name: string
    @IsString()
    @MinLength(3)
    @MaxLength(10)
    @IsNotEmpty()
    slogan: string
}
export class idDto {
    @IsMongoId()
    @IsNotEmpty()
    id: Types.ObjectId
}
@AtLeastOne(['name', 'slogan'])
export class UpdateBrandDto extends PartialType(CreateBrandDto) {
}
export class queryDto {
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    page?: number
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    limit?: number
    @IsOptional()
    @IsString()
    search?: string
}

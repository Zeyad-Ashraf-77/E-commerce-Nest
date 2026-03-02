import { Type } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength, Validate } from "class-validator";
import { Types } from "mongoose";
import { PartialType } from "@nestjs/mapped-types";
import { AtLeastOne, idMongo } from "src/cammon/decretors";


export class CreateSubCategoryDto {
    @IsString()
    @MinLength(3)
    @MaxLength(30)
    @IsNotEmpty()
    name: string
    @Validate(idMongo)
    category: Types.ObjectId[]
}
export class idDto {
    @IsMongoId()
    @IsNotEmpty()
    id: Types.ObjectId
}
@AtLeastOne(['name', 'slogan'])
export class UpdateSubCategoryDto extends PartialType(CreateSubCategoryDto) {
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

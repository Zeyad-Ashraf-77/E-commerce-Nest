import { Type } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength, Validate } from "class-validator";
import { Types } from "mongoose";
import { PartialType } from "@nestjs/mapped-types";
import { AtLeastOne, idMongo } from "src/cammon/decretors";


export class CreatecategoryDto {
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

    @IsOptional()
    @Validate(idMongo)
    brands: Types.ObjectId[]
}
export class idDto {
    @IsMongoId()
    @IsNotEmpty()
    id: Types.ObjectId
}
@AtLeastOne(['name', 'slogan'])
export class UpdatecategoryDto extends PartialType(CreatecategoryDto) {
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


import { Type } from "class-transformer";
import { isEmail, IsMongoId, isMongoId, isNotEmpty, IsNotEmpty, IsNumber, IsString, MaxLength, Min, MinLength, Validate } from "class-validator";
import { Types } from "mongoose";
import { PartialType } from "@nestjs/mapped-types";
import { AtLeastOne, idMongo } from "src/cammon/decretors";

export class CreateProductDto {
    @IsString()
    @MinLength(3)
    @MaxLength(300)
    @IsNotEmpty()
    name: string
    @IsString()
    @MinLength(30)
    @MaxLength(30000)
    @IsNotEmpty()
    discraption: string
    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    @Type(() => Number)
    price: number
    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    @Type(() => Number)
    discount: number
    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    @Type(() => Number)
    stock: number
    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    @Type(() => Number)
    quantity: number
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    @IsNotEmpty()
    @Validate(idMongo)
    brand: Types.ObjectId
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    @IsNotEmpty()
    @Validate(idMongo)
    category: Types.ObjectId
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    @IsNotEmpty()
    @Validate(idMongo)
    subCategory: Types.ObjectId
}
@AtLeastOne(['name', 'discraption', 'quantity', 'price', 'discount', 'stock', 'brand', 'category', 'subCategory'])
export class UpdateProductDto extends PartialType(CreateProductDto) { }

export class paramDto {
    @IsMongoId()
    @IsNotEmpty()
    id: Types.ObjectId
}



import { Type } from "class-transformer";
import { isEmail, IsMongoId, isMongoId, isNotEmpty, IsNotEmpty, IsNumber, IsString, MaxLength, Min, MinLength, Validate } from "class-validator";
import { Types } from "mongoose";
import { PartialType } from "@nestjs/mapped-types";
import { AtLeastOne, idMongo } from "src/cammon/decretors";

export class CreateCartDto {
    @IsNotEmpty()
    @Validate(idMongo)
    productId: Types.ObjectId
    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    @Type(() => Number)
    quantity: number    
}
export class UpdateQuantityDto {
    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    @Type(() => Number)
    quantity: number    
}

@AtLeastOne(['productId', 'quantity'])
export class UpdateCartDto extends PartialType(CreateCartDto) { }

export class paramDto {
    @Validate(idMongo)
    @IsNotEmpty()
    id: Types.ObjectId
}


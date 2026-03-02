import { Body, Controller, Delete, Get, Param, ParseFilePipe, Patch, Post, Query, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto, idDto, queryDto, UpdateBrandDto } from './brand.dto';
import type { userRequest } from 'src/cammon/interfaces';
import { Auth } from 'src/cammon/decretors';
import { UserRole } from 'src/cammon/enume';
import { TokenType } from 'src/cammon/enume';
import { FileInterceptor } from '@nestjs/platform-express';
import { filevalidation, multerCloud } from 'src/cammon/utils/multer';
@Controller('brands')
export class BrandController {
    constructor(private readonly brandService: BrandService) { }
    @Auth(TokenType.access, [UserRole.ADMIN])
    @UseInterceptors(FileInterceptor('attachment', multerCloud({ fileType: filevalidation.image })))
    @Post()
    async createBrand(
        @Body() brandDto: CreateBrandDto,
        @Req() req: userRequest,
        @UploadedFile(ParseFilePipe) file: Express.Multer.File) {
        const brand = await this.brandService.createBrand(brandDto, req, file);
        return { message: "successfully", brand };
    }
    @Auth(TokenType.access, [UserRole.ADMIN])
    @Patch('update/:id')
    async updateBrand(
        @Param() params: idDto,
        @Body() brandDto: UpdateBrandDto,
        @Req() req: userRequest,
    ) {
        const brand = await this.brandService.updateBrand(params.id, brandDto, req);
        return { message: "successfully", brand };
    }
    @Auth(TokenType.access, [UserRole.ADMIN])
    @UseInterceptors(FileInterceptor('attachment', multerCloud({ fileType: filevalidation.image })))
    @Patch('updateImage/:id')
    async updateBrandImage(
        @Param() params: idDto,
        @UploadedFile(ParseFilePipe) file: Express.Multer.File,
        @Req() req: userRequest,
    ) {
        const brand = await this.brandService.updateBrandImage(params.id, file, req);
        return { message: "successfully", brand };
    }
    @Auth(TokenType.access, [UserRole.ADMIN])
    @Patch('freaze/:id')
    async freazeBrand(
        @Param() params: idDto,
        @Req() req: userRequest,
    ) {
        const brand = await this.brandService.freazeBrand(params.id, req);
        return { message: "successfully", brand };
    }
    @Auth(TokenType.access, [UserRole.ADMIN])
    @Patch('restore/:id')
    async restoreBrand(
        @Param() params: idDto,
        @Req() req: userRequest,
    ) {
        const brand = await this.brandService.restoreBrand(params.id, req);
        return { message: "successfully", brand };
    }
    @Auth(TokenType.access, [UserRole.ADMIN])
    @Delete(':id')
    async deleteBrand(
        @Param() params: idDto,
    ) {
        const brand = await this.brandService.deleteBrand(params.id);
        return { message: "successfully", brand };
    }
    @Get()
    async getAllBrands(
        @Query() query:queryDto,
    ) {
        const {data,count} = await this.brandService.getAllBrands(query);
        return { message: "successfully", data,count };
    }
}

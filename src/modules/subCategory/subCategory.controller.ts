import { Body, Controller, Delete, Get, Param, ParseFilePipe, Patch, Post, Query, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { SubCategoryService } from './subCategory.service';
import { CreateSubCategoryDto, idDto, queryDto, UpdateSubCategoryDto } from './subCategory.dto';
import type { userRequest } from 'src/cammon/interfaces';
import { Auth } from 'src/cammon/decretors';
import { UserRole } from 'src/cammon/enume';
import { TokenType } from 'src/cammon/enume';
import { FileInterceptor } from '@nestjs/platform-express';
import { filevalidation, multerCloud } from 'src/cammon/utils/multer';
@Controller('subcategories')
export class subCategoryController {
    constructor(private readonly subCategoryService: SubCategoryService) { }

    @Auth(TokenType.access, [UserRole.ADMIN])
    @UseInterceptors(FileInterceptor('attachment', multerCloud({ fileType: filevalidation.image })))
    @Post()
    async createSubCategory(
        @Body() subCategoryDto: CreateSubCategoryDto,
        @Req() req: userRequest,
        @UploadedFile(ParseFilePipe) file: Express.Multer.File) {
        const subCategory = await this.subCategoryService.createSubCategory(subCategoryDto, req, file);
        return { message: "successfully", subCategory };
    }


    @Auth(TokenType.access, [UserRole.ADMIN])
    @Patch('update/:id')
    async updatesubCategory(
        @Param() params: idDto,
        @Body() subCategoryDto: UpdateSubCategoryDto,
        @Req() req: userRequest,
    ) {
        const subCategory = await this.subCategoryService.updateSubCategory(params.id, subCategoryDto, req);
        return { message: "successfully", subCategory };
    }
    @Auth(TokenType.access, [UserRole.ADMIN])
    @UseInterceptors(FileInterceptor('attachment', multerCloud({ fileType: filevalidation.image })))
    @Patch('updateImage/:id')
    async updateSubCategoryImage(
        @Param() params: idDto,
        @UploadedFile(ParseFilePipe) file: Express.Multer.File,
        @Req() req: userRequest,
    ) {
        const subCategory = await this.subCategoryService.updateSubCategoryImage(params.id, file, req);
        return { message: "successfully", subCategory };
    }
    @Auth(TokenType.access, [UserRole.ADMIN])
    @Patch('freaze/:id')
    async freazeSubCategory(
        @Param() params: idDto,
        @Req() req: userRequest,
    ) {
        const subCategory = await this.subCategoryService.freazeSubCategory(params.id, req);
        return { message: "successfully", subCategory };
    }
    @Auth(TokenType.access, [UserRole.ADMIN])
    @Patch('restore/:id')
    async restoreSubCategory(
        @Param() params: idDto,
        @Req() req: userRequest,
    ) {
        const subCategory = await this.subCategoryService.restoreSubCategory(params.id, req);
        return { message: "successfully", subCategory };
    }
    @Auth(TokenType.access, [UserRole.ADMIN])
    @Delete(':id')
    async deleteSubCategory(
        @Param() params: idDto,
    ) {
        const subCategory = await this.subCategoryService.deleteSubCategory(params.id);
        return { message: "successfully", subCategory };
    }
    @Get()
    async getAllSubCategories(
        @Query() query: queryDto,
    ) {
        const { data, count } = await this.subCategoryService.getAllSubCategories(query);
        return { message: "successfully", data, count };
    }
}

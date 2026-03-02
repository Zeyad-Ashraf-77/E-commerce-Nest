import { Body, Controller, Delete, Get, Param, ParseFilePipe, Patch, Post, Query, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { categoryService } from './category.service';
import { CreatecategoryDto, idDto, queryDto, UpdatecategoryDto } from './category.dto';
import type { userRequest } from 'src/cammon/interfaces';
import { Auth } from 'src/cammon/decretors';
import { UserRole } from 'src/cammon/enume';
import { TokenType } from 'src/cammon/enume';
import { FileInterceptor } from '@nestjs/platform-express';
import { filevalidation, multerCloud } from 'src/cammon/utils/multer';
@Controller('categories')
export class categoryController {
    constructor(private readonly categoryService: categoryService) { }

    @Auth(TokenType.access, [UserRole.ADMIN])
    @UseInterceptors(FileInterceptor('attachment', multerCloud({ fileType: filevalidation.image })))
    @Post()
    async createcategory(
        @Body() categoryDto: CreatecategoryDto,
        @Req() req: userRequest,
        @UploadedFile(ParseFilePipe) file: Express.Multer.File) {
        const category = await this.categoryService.createcategory(categoryDto, req, file);
        return { message: "successfully", category };
    }


    @Auth(TokenType.access, [UserRole.ADMIN])
    @Patch('update/:id')
    async updatecategory(
        @Param() params: idDto,
        @Body() categoryDto: UpdatecategoryDto,
        @Req() req: userRequest,
    ) {
        const category = await this.categoryService.updatecategory(params.id, categoryDto, req);
        return { message: "successfully", category };
    }
    @Auth(TokenType.access, [UserRole.ADMIN])
    @UseInterceptors(FileInterceptor('attachment', multerCloud({ fileType: filevalidation.image })))
    @Patch('updateImage/:id')
    async updatecategoryImage(
        @Param() params: idDto,
        @UploadedFile(ParseFilePipe) file: Express.Multer.File,
        @Req() req: userRequest,
    ) {
        const category = await this.categoryService.updatecategoryImage(params.id, file, req);
        return { message: "successfully", category };
    }
    @Auth(TokenType.access, [UserRole.ADMIN])
    @Patch('freaze/:id')
    async freazecategory(
        @Param() params: idDto,
        @Req() req: userRequest,
    ) {
        const category = await this.categoryService.freazecategory(params.id, req);
        return { message: "successfully", category };
    }
    @Auth(TokenType.access, [UserRole.ADMIN])
    @Patch('restore/:id')
    async restorecategory(
        @Param() params: idDto,
        @Req() req: userRequest,
    ) {
        const category = await this.categoryService.restorecategory(params.id, req);
        return { message: "successfully", category };
    }
    @Auth(TokenType.access, [UserRole.ADMIN])
    @Delete(':id')
    async deletecategory(
        @Param() params: idDto,
    ) {
        const category = await this.categoryService.deletecategory(params.id);
        return { message: "successfully", category };
    }
    @Get()
    async getAllcategories(
        @Query() query:queryDto,
    ) {
        const {data,count} = await this.categoryService.getAllcategories(query);
        return { message: "successfully", data,count };
    }
}

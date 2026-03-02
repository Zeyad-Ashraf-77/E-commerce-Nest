import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerLocal = (fileType: string[]) => {
    return {
        storage: diskStorage({
            destination: './uploads',
            filename: (req: Request, file: Express.Multer.File, cb: Function) => {
                const randomName = Array(32).fill(null).map(() => Math.round(Math.random() * 16).toString(16)).join('');
                return cb(null, `${randomName}${extname(file.originalname)}`);
            }
        }),
        fileFilter: (req: Request, file: Express.Multer.File, cb: Function) => {
            if (!file.originalname.match(fileType.join('|'))) {
                return cb(new BadRequestException('Invalid file type'), false);
            }
            cb(null, true);
        },
        limits: {
            fileSize: 1024 * 1024 * 5,
        }
    }
}
import multer from "multer"
import { BadRequestException } from "@nestjs/common";
import type { Request } from "express";

import os from "os";
import { filevalidation } from "./multer.fileValidation";
import { StoreType } from "src/cammon/enume/multer.enum";

export const multerCloud = ({
    fileType = filevalidation.image,
    storeType = StoreType.memory
}: {
    fileType?: string[]
    storeType?: StoreType
}) => {
    return {
        storage: storeType === StoreType.memory ? multer.memoryStorage()
            : multer.diskStorage({
                destination: os.tmpdir(),
                filename: (req: Request, file: Express.Multer.File, cb) => {
                    cb(null, `${Date.now()} - ${file.originalname}`)
                },
            }),
        fileFilter: (req: Request, file: Express.Multer.File, cb: Function) => {
            if (!fileType.includes(file.mimetype)) {
                cb(new BadRequestException("Invalid file type"))
            } else {
                cb(null, true)
            }
        },
        limits: {
            fileSize: 1024 * 1024 * 5,
        }
    }
}
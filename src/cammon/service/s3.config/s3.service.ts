import { DeleteObjectCommand, DeleteObjectCommandOutput, DeleteObjectsCommand, DeleteObjectsCommandOutput, GetObjectCommand, GetObjectCommandOutput, ListObjectsV2Command, ObjectCannedACL, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { BadRequestException, Injectable } from "@nestjs/common";
import { createReadStream } from "fs";
import { StoreType } from "src/cammon/enume/multer.enum";

@Injectable()
export class S3Service {
    private readonly s3Client: S3Client;
    constructor(

    ) {
        this.s3Client = new S3Client({
            region: process.env.AWS_REGION!,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
            },
        })
    }

    uploadFile = async ({
        store = StoreType.memory,
        Bucket = process.env.S3_BUCKET_NAME as string,
        path = "general",
        ACL = "private" as ObjectCannedACL,
        file,
    }: {
        store?: StoreType;
        Bucket?: string;
        path?: string | undefined;
        ACL?: ObjectCannedACL;
        file: Express.Multer.File;
    }): Promise<string> => {
        const Key = `${process.env.APPLICATION_NAME
            }/${path}/${Date.now()}__${Math.random()}/${file.originalname}`;

        if (store === StoreType.memory) {
            const command = new PutObjectCommand({
                Bucket,
                Key,
                ACL,
                Body: file.buffer,
                ContentType: file.mimetype,
            });
            await this.s3Client.send(command);
        } else {
            const upload = new Upload({
                client: this.s3Client,
                params: {
                    Bucket,
                    Key,
                    ACL,
                    Body: createReadStream(file.path),
                    ContentType: file.mimetype,
                },
            });
            await upload.done();
        }

        return Key;
    };

    uploadFiles = async ({
        files,
        store = StoreType.memory,
        path = "general",
        Bucket = process.env.S3_BUCKET_NAME as string,
        ACL = "private" as ObjectCannedACL,
    }: {
        store?: StoreType;
        Bucket?: string;
        path?: string;
        ACL?: ObjectCannedACL;
        files: Express.Multer.File[];
    }): Promise<string[] | any> => {

        const urls: string[] = await Promise.all(
            files.map((file) => this.uploadFile({ store, Bucket, ACL, path, file }))
        );
        return urls;
    };

    uploadLargeFile = async ({
        store = StoreType.memory,
        Bucket = process.env.S3_BUCKET_NAME as string,
        path = "general",
        ACL = "private" as ObjectCannedACL,
        file,
    }: {
        store?: StoreType;
        Bucket?: string;
        path?: string | undefined;
        ACL?: ObjectCannedACL;
        file: Express.Multer.File;
    }) => {
        const upload = new Upload({
            client: this.s3Client,
            params: {
                Bucket,
                Key: `${process.env.APPLICATION_NAME
                    }/${path}/${Date.now()}__${Math.random()}_250/${file.originalname}`,
                ACL,
                Body:
                    store === StoreType.memory
                        ? file.buffer
                        : createReadStream(file.path),
                ContentType: file.mimetype,
            },
        });

        upload.on("httpUploadProgress", (progress) => {
            console.log(`File upload progress is ::: `, progress);
        });
        return await upload.done();
    };

    getFile = async ({
        Bucket = process.env.S3_BUCKET_NAME as string,
        Key,
    }: {
        Bucket?: string;
        Key: string;
    }): Promise<GetObjectCommandOutput> => {
        const command = new GetObjectCommand({
            Bucket,
            Key,
        });
        return await this.s3Client.send(command);
    };

    listFiles = async ({
        Bucket = process.env.S3_BUCKET_NAME as string,
        folderKey,
    }: {
        Bucket?: string;
        folderKey: string;
    }) => {
        const command = new ListObjectsV2Command({
            Bucket,
            Prefix: `${process.env.APPLICATION_NAME}/${folderKey}`,
        });

        const objectList = await this.s3Client.send(command);
        console.log({ objectList });
        return objectList;
    };
    deleteFile = async ({
        Bucket = process.env.S3_BUCKET_NAME as string,
        Key,
    }: {
        Bucket?: string;
        Key: string;
    }): Promise<DeleteObjectCommandOutput> => {
        const command = new DeleteObjectCommand({
            Bucket,
            Key,
        });
        return await this.s3Client.send(command);
    };
    deleteFiles = async ({
        Bucket = process.env.S3_BUCKET_NAME,
        keysToDelete,
        Quiet = false,
    }: {
        Bucket?: string;
        keysToDelete: string[];
        Quiet?: boolean;
    }): Promise<DeleteObjectsCommandOutput> => {
        const mappedKeysToDelete: { Key: string }[] = keysToDelete.map((Key) => {
            return { Key };
        });

        const command = new DeleteObjectsCommand({
            Bucket,
            Delete: {
                Objects: mappedKeysToDelete,
                Quiet,
            },
        });
        const result = await this.s3Client.send(command);
        console.log(result);
        return result;
    };

    deleteFolderContent = async ({
        Bucket = process.env.S3_BUCKET_NAME as string,
        Quiet = false,
        folderKey,
    }: {
        Bucket?: string;
        Quiet?: boolean;
        folderKey: string;
    }) => {
        const objects = await this.listFiles({ Bucket, folderKey });
        const keysToDelete: string[] = objects.Contents?.map((obj) => {
            return obj.Key;
        }) as string[];
        console.log({ keysToDelete });
        return await this.deleteFiles({ Bucket, keysToDelete, Quiet });
    };


}
// trigger rebuild
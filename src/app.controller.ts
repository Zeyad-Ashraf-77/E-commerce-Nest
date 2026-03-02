import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import type { Request, Response } from 'express';
import { S3Service } from './cammon/service/s3.config/s3.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly s3Service: S3Service) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get("/upload/*")
  async getFile(@Req() req: Request, @Res() res: Response) {
    try {
      const fullPath = req.path;
      const path = fullPath.replace('/upload/', '');

      console.log("Full path:", fullPath);
      console.log("Extracted path:", path);

      if (!path) {
        return res.status(400).json({
          message: "Path is required"
        });
      }

      // Decode the URL-encoded path (e.g., %20 -> space)
      const decodedPath = decodeURIComponent(path);
      console.log("Decoded path:", decodedPath);
      console.log("S3 Key:", decodedPath);

      const result = await this.s3Service.getFile({ Key: decodedPath });
      const stream = result.Body as NodeJS.ReadableStream;

      res.set("cross-origin-resource-policy", "cross-origin");
      res.setHeader("Content-Type", result?.ContentType || "application/octet-stream");
      stream.pipe(res);
    } catch (error) {
      console.error("Error fetching file from S3:", error);
      res.status(500).json({
        message: "Error fetching file",
        error: error.message,
        details: error
      });
    }
  }
}

import {
  PipeTransform,
  ArgumentMetadata,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ZodType } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    const { success, error } = this.schema.safeParse(value);
    if (!success) {
      throw new HttpException(
        { message: 'validation error', error: error.issues },
        HttpStatus.BAD_REQUEST,
      );
    }
    return value;
  }
}

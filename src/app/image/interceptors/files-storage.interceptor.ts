import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Type,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Injectable()
export class FilesStorageInterceptor implements NestInterceptor {
  private staticFilesInterceptor: Type<NestInterceptor>;
  private readonly MAX_QUANTITY_FILE_UPLOAD = 10;
  constructor() {
    if (this.staticFilesInterceptor) return;
    this.staticFilesInterceptor = FilesInterceptor(
      'files',
      this.MAX_QUANTITY_FILE_UPLOAD,
      {
        storage: diskStorage({
          destination: 'uploads', // Đường dẫn lưu trữ tệp
          filename: (req, file, callback) => {
            const now = new Date();
            const pad = (num) => String(num).padStart(2, '0');
            const formattedDateTime = `${now.getFullYear()}_${pad(
              now.getMonth() + 1
            )}_${pad(now.getDate())}_(${pad(now.getHours())}_${pad(
              now.getMinutes()
            )}_${pad(now.getSeconds())})`;
            const uniqueSuffix = `${formattedDateTime}_${crypto.randomUUID()}`;
            const originalName = file.originalname;
            const fileNameOriginal = originalName.slice(
              0,
              originalName.lastIndexOf('.')
            );
            const filename = `${uniqueSuffix}_${
              file.fieldname
            }_${fileNameOriginal}${extname(originalName)}`;
            callback(null, filename);
          },
        }),
      }
    );
  }
  intercept(context: ExecutionContext, next: CallHandler) {
    return new this.staticFilesInterceptor().intercept(context, next);
  }
}

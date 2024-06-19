import { Injectable } from '@nestjs/common';

@Injectable()
export class FileUtilService {
  removeFileExtension(fileName) {
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex === -1) {
      return fileName;
    }
    return fileName.slice(0, lastDotIndex);
  }
}

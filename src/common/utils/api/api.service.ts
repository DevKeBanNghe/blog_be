import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ApiResponse, FormatPagination } from './api.entity';
import { ConfigService } from '@nestjs/config';
import { PATHS_NOT_AUTH } from 'src/consts/api.const';

@Injectable()
export class ApiService {
  constructor(private configService: ConfigService) {}

  private removeQueryParameters(path: string) {
    const indexQuery = path.indexOf('?');
    if (indexQuery < 0) return path;
    return path.slice(0, indexQuery);
  }

  isPathNotAuth({ originalUrl }) {
    const rootPath = this.removeQueryParameters(originalUrl);
    return PATHS_NOT_AUTH.some((path) => rootPath.includes(path));
  }

  getPayload(req: Request) {
    return { ...req.query, ...req.params, ...req.body };
  }

  formatResponse({
    timestamp = new Date().toISOString(),
    path,
    errors = null,
    data = null,
  }: ApiResponse) {
    return {
      timestamp,
      path,
      errors,
      data,
    };
  }

  formatPagination<T>(formatPagination: FormatPagination<T>) {
    return new FormatPagination<T>(formatPagination);
  }
}

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { ApiService } from '../../utils/api/api.service';
import { Request } from 'src/common/interfaces/http.interface';

@Injectable()
export class AccessControlGuard implements CanActivate {
  constructor(private apiService: ApiService) {}

  async canActivate(context: ExecutionContext) {
    const { getRequest, getResponse } = context.switchToHttp();
    const req = getRequest<Request>();
    const res = getResponse<Response>();
    const { originalUrl } = req;

    if (this.apiService.isPathNotAuth({ originalUrl })) return true;

    return true;
  }
}

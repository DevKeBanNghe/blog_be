import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request, Response } from 'express';
import { ApiService } from '../utils/api/api.service';
import {
  COOKIE_SSO_ACCESS_TOKEN_KEY,
  COOKIE_SSO_REFRESH_TOKEN_KEY,
} from 'src/consts/cookie.const';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private apiService: ApiService) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { getRequest, getResponse } = context.switchToHttp();
    const req = getRequest<Request>();
    const res = getResponse<Response>();

    if (this.apiService.isPathNotAuth(req.originalUrl)) return true;

    // Check permission here

    return true;
  }
}

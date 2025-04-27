import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { StringUtilService } from 'src/common/utils/string/string-util.service';
import { Request, Response } from 'express';
import { cookieConfigsDefault } from 'src/consts/cookie.const';
import { AuthService } from '../auth.service';
import { ApiService } from 'src/common/utils/api/api.service';

@Injectable()
export class SaveTokenInterceptor implements NestInterceptor {
  constructor(
    protected stringUtilService: StringUtilService,
    private authService: AuthService,
    private apiServie: ApiService
  ) {}

  async setTokenToCookie(res: Response, { access_token, refresh_token }) {
    const cookieKeys = await this.authService.getCookieKeys();
    const { access_token_key, refresh_token_key } = cookieKeys;
    if (access_token)
      res.cookie(access_token_key, access_token, cookieConfigsDefault);
    if (refresh_token)
      res.cookie(refresh_token_key, refresh_token, cookieConfigsDefault);
    return res;
  }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { getRequest, getResponse } = context.switchToHttp();
    const req = getRequest<Request>();
    const res = getResponse<Response>();
    return next.handle().pipe(
      map((data) => {
        if (data?.access_token || data?.refresh_token) {
          this.setTokenToCookie(res, data)
            .then(() => {
              res.status(200).json(
                this.apiServie.formatResponse({
                  path: req.path,
                  data,
                })
              );
            })
            .catch((error) => {
              Logger.error(error.message, data);
            });
        }
        return data;
      })
    );
  }
}

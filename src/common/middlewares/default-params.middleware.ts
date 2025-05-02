import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { IncomingHttpHeaders } from 'http2';
import { StringUtilService } from '../utils/string/string-util.service';
import { ConfigService } from '@nestjs/config';
import { EnvVars } from 'src/consts/env.const';
import { HttpHeaders } from 'src/consts/enum.const';
import { UserService } from 'src/app/user/user.service';
import { Request } from '../interfaces/http.interface';
import { ApiService } from '../utils/api/api.service';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
@Injectable()
export class DefaultParamsMiddleware implements NestMiddleware {
  private userService: UserService;
  constructor(
    private stringUtilService: StringUtilService,
    private configService: ConfigService,
    private apiService: ApiService,
    private moduleRef: ModuleRef
  ) {}
  private customHeaders(headers: IncomingHttpHeaders) {
    const headersValueCustom = {
      [HttpHeaders.REQUEST_ID]:
        headers[HttpHeaders.REQUEST_ID] ?? this.stringUtilService.random(),
      [HttpHeaders.VERSION]:
        headers[HttpHeaders.VERSION] ??
        this.configService.get(EnvVars.API_VERSION),
    };

    const data = Object.entries(headersValueCustom).reduce(
      (acc, [key, value]) => {
        acc[key] = value;
        return acc;
      },
      structuredClone(headers)
    );
    return data;
  }
  async use(req: Request, res: Response, next: NextFunction) {
    const headersCustom = this.customHeaders(req.headers);
    req.headers = headersCustom;
    if (this.apiService.isPathNotAuth({ originalUrl: req.originalUrl }))
      return next();
    const contextId = ContextIdFactory.create();
    this.moduleRef.registerRequestByContextId(req, contextId);
    this.userService = await this.moduleRef.resolve(UserService, contextId);
    const user = await this.userService.getUserInfo();
    const userRequest = req.user ?? {};
    const userData = { ...userRequest, ...user };
    req.user = userData;
    req.body.user = userData;
    next();
  }
}

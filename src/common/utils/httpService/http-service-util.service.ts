import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { AxiosInstance } from 'axios';
import { Request } from 'express';
import {
  COOKIE_SSO_ACCESS_TOKEN_KEY,
  COOKIE_SSO_REFRESH_TOKEN_KEY,
} from 'src/consts/cookie.const';
@Injectable()
export class HttpServiceUtilService {
  private _axios: AxiosInstance;
  constructor(
    @Inject(REQUEST) private req: Request,
    private readonly httpService: HttpService
  ) {
    this._axios = this.httpService.axiosRef;
    this.initConfigAxios();
  }

  initConfigAxios() {
    this._axios.defaults.headers['x-webpage-key'] =
      this.req.headers['x-webpage-key'];

    const token =
      this.req.cookies[COOKIE_SSO_ACCESS_TOKEN_KEY] ??
      this.req.cookies[COOKIE_SSO_REFRESH_TOKEN_KEY] ??
      '';
    this._axios.defaults.headers['Authorization'] = `Bearer ${token}`;

    this._axios.interceptors.response.use(
      (res) => res,
      ({ response: { data, status } }) => {
        return { data, status };
      }
    );
  }

  get axios() {
    return this._axios;
  }
}

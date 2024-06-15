import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { EnvVars } from 'src/consts';
import {
  COOKIE_SSO_ACCESS_TOKEN_KEY,
  COOKIE_SSO_REFRESH_TOKEN_KEY,
} from 'src/consts/cookie.const';

@Injectable()
export class HttpServiceUtilService implements OnModuleInit {
  private axios: AxiosInstance;
  constructor(private readonly httpService: HttpService) {
    this.axios = this.httpService.axiosRef;
  }

  onModuleInit() {
    this.httpService.axiosRef.defaults.withCredentials = true;
    this.axios.interceptors.response.use(
      ({ data: data_res, status }) => {
        return { ...data_res, status };
      },
      async ({ response: { data, status } }) => {
        return { ...data, status };
      }
    );
  }

  get(
    url: string,
    options?: AxiosRequestConfig
  ): Promise<AxiosResponse<any, any> & { [key: string]: any }> {
    return this.axios.get(url, options);
  }
}

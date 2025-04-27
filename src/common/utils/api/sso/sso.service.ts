import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvVars, HttpHeaders } from 'src/consts';
import { HttpServiceUtilService } from '../../httpService/http-service-util.service';
import { SubscribeUserDto } from './dto/subscribe-user.dto';
import { REQUEST } from '@nestjs/core';
import { AxiosInstance } from 'axios';
import { Request } from 'express';
@Injectable()
export class SSOService {
  private url: string;
  private axios: AxiosInstance;
  constructor(
    @Inject(REQUEST) private req: Request,
    private configService: ConfigService,
    private httpServiceUtilService: HttpServiceUtilService
  ) {
    this.url = this.configService.get(EnvVars.SSO_BE_URL);
    this.axios = this.httpServiceUtilService.axios;
    this.axios.defaults.withCredentials = true;
    this.setAxiosHeaders();
    this.initCookieConfig();
    this.initConfigAxiosSSO();
  }

  setAxiosHeaders() {
    for (const key of Object.values(HttpHeaders)) {
      this.axios.defaults.headers[key] = this.req.headers[key];
    }
  }

  async initCookieConfig() {
    const { data: { data, errors } = {} } = await this.getCookieKeys();
    if (errors) throw new InternalServerErrorException(errors);
    const { access_token_key, refresh_token_key } = data;
    const token =
      this.req.cookies[access_token_key] ??
      this.req.cookies[refresh_token_key] ??
      '';
    this.axios.defaults.headers['Authorization'] = `Bearer ${token}`;
  }

  initConfigAxiosSSO() {
    this.axios.interceptors.response.use(
      (res) => res,
      (res) => {
        const response = res.response;
        if (response) {
          const { data, status } = response;
          return { data, status };
        }
        return res;
      }
    );
  }

  async getUserInfo() {
    const data = await this.axios.get(`${this.url}/users/info`);
    return data;
  }

  async refreshToken(params = {}) {
    const data = await this.axios.get(`${this.url}/auth/refresh-token`, {
      params,
    });
    return data;
  }

  async getCookieKeys() {
    const data = await this.axios.get(`${this.url}/auth/cookie-keys`);
    return data;
  }

  async subscribeUser(payload: SubscribeUserDto) {
    const data = await this.axios.post(`${this.url}/users/subscribe`, payload);
    return data;
  }
}

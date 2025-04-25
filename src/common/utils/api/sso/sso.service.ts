import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvVars } from 'src/consts';
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
    this.axios = this.initConfigAxiosSSO();
    this.getCookieKeys().then(({ data: { data, errors } }) => {
      if (errors) throw new InternalServerErrorException(errors);
      const { access_token_key, refresh_token_key } = data;
      const token =
        this.req.cookies[access_token_key] ??
        this.req.cookies[refresh_token_key] ??
        '';
      this.axios.defaults.headers['Authorization'] = `Bearer ${token}`;
    });
  }

  initConfigAxiosSSO() {
    if (this.axios) return this.axios;
    const axiosInstance = this.httpServiceUtilService.axios;
    axiosInstance.defaults.headers['x-webpage-key'] =
      this.req.headers['x-webpage-key'];

    axiosInstance.interceptors.response.use(
      (res) => res,
      ({ response: { data, status } }) => {
        return { data, status };
      }
    );
    return axiosInstance;
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
